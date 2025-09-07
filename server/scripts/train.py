import sys
import json
import pandas as pd
from pymongo import MongoClient
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.preprocessing import OneHotEncoder
import numpy as np
import joblib
import pickle
from bson.binary import Binary
from bson.objectid import ObjectId

def train_model(model_id, model_type, file_path, test_size, random_state):
    client = MongoClient('mongodb://localhost:27017/')
    db = client['clbp-predictive-system']

    try:
        # --- 1. Load data from the provided file ---
        if not file_path.endswith('.csv'):
            raise ValueError("Only .csv files are currently supported.")

        df = pd.read_csv(file_path)

        # --- 2. Preprocess Data ---
        # Assuming the last column is the target variable
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]

        categorical_features = X.select_dtypes(include=['object']).columns
        if not categorical_features.empty:
            encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
            encoded_features = pd.DataFrame(encoder.fit_transform(X[categorical_features]), columns=encoder.get_feature_names_out(categorical_features))
            X = pd.concat([X.drop(categorical_features, axis=1), encoded_features], axis=1)

        # --- 3. Split Data ---
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)

        # --- 4. Train Model ---
        model_map = {
            'LogisticRegression': LogisticRegression(random_state=random_state, max_iter=1000),
            'DecisionTree': DecisionTreeClassifier(random_state=random_state),
            'RandomForest': RandomForestClassifier(random_state=random_state),
            'GradientBoosting': GradientBoostingClassifier(random_state=random_state),
            'SVM': SVC(random_state=random_state, probability=True)
        }

        if model_type not in model_map:
            raise NotImplementedError(f"Model type '{model_type}' is not implemented.")

        model = model_map[model_type]
        model.fit(X_train, y_train)

        # --- 5. Evaluate Model ---
        y_pred_proba = model.predict_proba(X_test)[:, 1]
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        auc = roc_auc_score(y_test, y_pred_proba)

        # --- 6. Save Results ---
        serialized_model = pickle.dumps(model)

        db.predictionmodels.update_one(
            {'_id': model_id},
            {
                '$set': {
                    'status': 'completed',
                    'performance': {
                        'accuracy': accuracy,
                        'auc': auc
                    },
                    'modelData': Binary(serialized_model)
                }
            }
        )

        print(json.dumps({"status": "success", "modelId": str(model_id)}))

    except Exception as e:
        db.predictionmodels.update_one(
            {'_id': model_id},
            {'$set': {'status': 'failed', 'performance': {'error': str(e)}}}
        )
        print(json.dumps({"status": "error", "message": str(e)}))
    finally:
        client.close()

if __name__ == '__main__':
    if len(sys.argv) > 2:
        model_id_str = sys.argv[1]
        config = json.loads(sys.argv[2])

        model_id = ObjectId(model_id_str)

        model_type = config.get('modelType', 'LogisticRegression')
        file_path = config.get('filePath')
        test_size = float(config.get('parameters', {}).get('testSize', 0.2))
        random_state = int(config.get('parameters', {}).get('randomState', 42))

        if not file_path:
            print(json.dumps({"status": "error", "message": "filePath is required."}))
        else:
            train_model(model_id, model_type, file_path, test_size, random_state)
    else:
        print(json.dumps({"status": "error", "message": "Missing modelId or configuration."}))
