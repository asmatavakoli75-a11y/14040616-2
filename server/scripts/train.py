import sys
import json
import pandas as pd
import mysql.connector
import os
from dotenv import load_dotenv
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.preprocessing import OneHotEncoder
import pickle
import numpy as np

# Load environment variables from .env file
dotenv.config(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

def get_db_connection():
    """Establishes a connection to the MySQL database."""
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME'),
            port=os.getenv('DB_PORT')
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        return None

def update_model_status(model_id, status, performance=None, model_data=None):
    """Updates the model's status, performance, and data in the database."""
    conn = get_db_connection()
    if not conn:
        return

    try:
        cursor = conn.cursor()
        query = """
            UPDATE PredictionModels
            SET status = %s, performance = %s, modelData = %s, updatedAt = NOW()
            WHERE id = %s
        """
        # Convert performance dict to JSON string for storing
        performance_json = json.dumps(performance) if performance else None

        cursor.execute(query, (status, performance_json, model_data, model_id))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Database update error: {err}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def train_model(model_id, model_type, file_path, test_size, random_state):
    """Main function to train and evaluate the model."""
    try:
        # --- 1. Load data ---
        if not file_path.endswith('.csv'):
            raise ValueError("Only .csv files are currently supported.")
        df = pd.read_csv(file_path)

        # --- 2. Preprocess Data ---
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
        performance_metrics = {'accuracy': accuracy, 'auc': auc}

        update_model_status(model_id, 'completed', performance=performance_metrics, model_data=serialized_model)
        print(json.dumps({"status": "success", "modelId": model_id}))

    except Exception as e:
        error_message = str(e)
        update_model_status(model_id, 'failed', performance={'error': error_message})
        print(json.dumps({"status": "error", "message": error_message}))

if __name__ == '__main__':
    if len(sys.argv) > 2:
        model_id = int(sys.argv[1]) # ID is now an integer
        config = json.loads(sys.argv[2])

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
