#!/usr/bin/env python3
import argparse, json, sys
import pandas as pd, numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.exceptions import UndefinedMetricWarning
from sklearn.utils.multiclass import type_of_target
import warnings
from scipy.stats import pearsonr, chi2_contingency

warnings.filterwarnings("ignore", category=UndefinedMetricWarning)

def load_dataset(path):
    return pd.read_csv(path)

def prepare_features(df, target_col):
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found")
    y = df[target_col]
    X = df.drop(columns=[target_col])
    numeric_cols = X.select_dtypes(include=['number','bool']).columns.tolist()
    categorical_cols = [c for c in X.columns if c not in numeric_cols]
    return X, y, numeric_cols, categorical_cols

def get_algorithm(name):
    name = name.lower()
    if name == 'decision_tree':
        return DecisionTreeClassifier()
    if name == 'random_forest':
        return RandomForestClassifier()
    if name == 'gradient_boosting':
        return GradientBoostingClassifier()
    if name == 'logistic_regression':
        return LogisticRegression(max_iter=1000, solver='lbfgs')
    if name == 'svm':
        return SVC(probability=True)
    raise ValueError(f"Unknown algorithm '{name}'")

def train_and_evaluate(df, target_col, algorithms, splits):
    X, y, num_cols, cat_cols = prepare_features(df, target_col)
    results = {}
    for alg_name in algorithms:
        clf = get_algorithm(alg_name)
        pre = ColumnTransformer([('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols)], remainder='passthrough')
        pipe = Pipeline([('pre', pre), ('model', clf)])
        metrics = {}
        accs, aucs = [], []
        for s in splits:
            X_tr, X_te, y_tr, y_te = train_test_split(
                X, y, train_size=float(s),
                stratify=y if type_of_target(y)=='binary' else None,
                random_state=42
            )
            try:
                pipe.fit(X_tr, y_tr)
                y_pred = pipe.predict(X_te)
                acc = accuracy_score(y_te, y_pred)
                try:
                    y_prob = pipe.predict_proba(X_te)[:,1]
                except Exception:
                    try:
                        sc = pipe.decision_function(X_te)
                        y_prob = 1/(1+np.exp(-sc))
                    except Exception:
                        y_prob = None
                auc = roc_auc_score(y_te, y_prob) if (y_prob is not None and len(np.unique(y_te))>1) else None
                metrics[str(s)] = {'accuracy': float(acc), 'auc': (float(auc) if auc is not None else None)}
                accs.append(acc); aucs.append(auc if auc is not None else np.nan)
            except Exception as e:
                metrics[str(s)] = {'accuracy': None, 'auc': None, 'error': str(e)}
                accs.append(np.nan); aucs.append(np.nan)
        results[alg_name] = {
            'splits': metrics,
            'average_accuracy': float(np.nanmean(accs)) if len(accs) else None,
            'average_auc': float(np.nanmean(aucs)) if len(aucs) else None,
        }
    return results

def univariate_analysis(df, target_col, variables, method):
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found")
    out = {}
    target = df[target_col]
    target_enc = target if np.issubdtype(target.dtype, np.number) else pd.factorize(target)[0]
    for var in variables:
        if var not in df.columns:
            out[var] = {'error': f"Variable '{var}' not found"}
            continue
        col = df[var]
        if method=='pearson':
            col_enc = col if np.issubdtype(col.dtype, np.number) else pd.factorize(col)[0]
            try:
                corr, p = pearsonr(col_enc, target_enc)
                out[var] = {'statistic': float(corr), 'p_value': float(p)}
            except Exception as e:
                out[var] = {'error': str(e)}
        elif method=='chi2':
            try:
                chi2, p, dof, exp = chi2_contingency(pd.crosstab(col, target))
                out[var] = {'statistic': float(chi2), 'p_value': float(p), 'dof': int(dof)}
            except Exception as e:
                out[var] = {'error': str(e)}
        else:
            out[var] = {'error': f"Unknown method '{method}'"}
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--mode', choices=['train','univariate'], required=True)
    ap.add_argument('--dataset', required=True)
    ap.add_argument('--target', required=True)
    ap.add_argument('--algorithms', default='decision_tree,random_forest,gradient_boosting,logistic_regression,svm')
    ap.add_argument('--splits', default='0.8,0.7,0.6')
    ap.add_argument('--variables', default='')
    ap.add_argument('--method', default='pearson')
    a = ap.parse_args()

    df = load_dataset(a.dataset)
    if a.mode=='train':
        algos = [x.strip() for x in a.algorithms.split(',') if x.strip()]
        splits = [float(x) for x in a.splits.split(',') if x.strip()]
        print(json.dumps({'results': train_and_evaluate(df, a.target, algos, splits)}))
    else:
        vars = [x.strip() for x in a.variables.split(',') if x.strip()]
        print(json.dumps({'results': univariate_analysis(df, a.target, vars, a.method.lower())}))

if __name__=='__main__':
    main()
