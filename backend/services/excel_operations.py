import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
import re
import io
import os

class ExcelOperationValidator:
    """Validates that AI-requested operations are safe Excel operations"""
    
    # Allowed operations
    ALLOWED_OPERATIONS = {
        'drop_duplicates',
        'drop_na',
        'fill_na',
        'remove_column',
        'rename_column',
        'filter_rows',
        'sort_values',
        'replace_value',
        'change_type',
        'trim_whitespace',
        'upper_case',
        'lower_case',
        'capitalize',
        'round_numbers',
        'drop_empty_rows',
        'drop_empty_columns',
    }
    
    @classmethod
    def validate_operation(cls, operation: str, params: Dict[str, Any]) -> tuple[bool, str]:
        """
        Validate that the operation is safe to execute.
        
        Returns:
            tuple: (is_valid, error_message)
        """
        if operation not in cls.ALLOWED_OPERATIONS:
            return False, f"Operation '{operation}' is not allowed"
        
        # Additional validation per operation type
        if operation == 'remove_column' and 'column' not in params:
            return False, "Column name is required for remove_column operation"
        
        if operation == 'rename_column':
            if 'old_name' not in params or 'new_name' not in params:
                return False, "Both old_name and new_name are required for rename_column"
        
        if operation == 'filter_rows':
            if 'column' not in params or 'condition' not in params:
                return False, "Column and condition are required for filter_rows"
        
        if operation == 'sort_values' and 'columns' not in params:
            return False, "Columns parameter is required for sort_values"
        
        if operation == 'replace_value':
            if 'old_value' not in params or 'new_value' not in params:
                return False, "Both old_value and new_value are required for replace_value"
        
        return True, ""


class PandasExecutor:
    """Executes validated operations on pandas DataFrames"""
    
    def __init__(self, file_path: str, sheet_name: str):
        self.file_path = file_path
        self.sheet_name = sheet_name
        self.df = pd.read_excel(file_path, sheet_name=sheet_name)
        self.original_shape = self.df.shape
    
    def execute_operation(self, operation: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a validated operation on the DataFrame.
        
        Returns:
            Dict with operation results and statistics
        """
        method_name = f"_execute_{operation}"
        if not hasattr(self, method_name):
            raise ValueError(f"Operation {operation} not implemented")
        
        before_shape = self.df.shape
        before_columns = list(self.df.columns)
        
        # Execute the operation
        method = getattr(self, method_name)
        result = method(params)
        
        after_shape = self.df.shape
        after_columns = list(self.df.columns)
        
        # Calculate changes
        rows_removed = before_shape[0] - after_shape[0]
        cols_removed = before_shape[1] - after_shape[1]
        
        return {
            'success': True,
            'operation': operation,
            'summary': result.get('summary', 'Operation completed'),
            'rows_affected': rows_removed,
            'columns_affected': cols_removed,
            'before_shape': before_shape,
            'after_shape': after_shape,
            'column_changes': {
                'removed': [c for c in before_columns if c not in after_columns],
                'added': [c for c in after_columns if c not in before_columns]
            }
        }
    
    def _execute_drop_duplicates(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Remove duplicate rows"""
        subset = params.get('columns', None)
        initial_count = len(self.df)
        self.df = self.df.drop_duplicates(subset=subset, keep='first')
        removed = initial_count - len(self.df)
        return {'summary': f'Removed {removed} duplicate rows'}
    
    def _execute_drop_na(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Remove rows with missing values"""
        subset = params.get('columns', None)
        initial_count = len(self.df)
        self.df = self.df.dropna(subset=subset)
        removed = initial_count - len(self.df)
        return {'summary': f'Removed {removed} rows with missing values'}
    
    def _execute_fill_na(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Fill missing values"""
        fill_value = params.get('value', 0)
        columns = params.get('columns', None)
        if columns:
            self.df[columns] = self.df[columns].fillna(fill_value)
        else:
            self.df = self.df.fillna(fill_value)
        return {'summary': f'Filled missing values with {fill_value}'}
    
    def _execute_remove_column(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Remove a column"""
        column = params['column']
        if column in self.df.columns:
            self.df = self.df.drop(columns=[column])
            return {'summary': f'Removed column: {column}'}
        return {'summary': f'Column {column} not found'}
    
    def _execute_rename_column(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Rename a column"""
        old_name = params['old_name']
        new_name = params['new_name']
        if old_name in self.df.columns:
            self.df = self.df.rename(columns={old_name: new_name})
            return {'summary': f'Renamed column {old_name} to {new_name}'}
        return {'summary': f'Column {old_name} not found'}
    
    def _execute_filter_rows(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Filter rows based on condition"""
        column = params['column']
        condition = params['condition']  # e.g., "> 10", "== 'value'", "contains 'text'"
        
        initial_count = len(self.df)
        
        if column not in self.df.columns:
            return {'summary': f'Column {column} not found'}
        
        # Parse and apply condition safely
        if 'contains' in condition.lower():
            if "'" in condition:
                parts = condition.split("'")
                if len(parts) > 1:
                    search_term = parts[1]
                else:
                    return {'summary': f"Invalid condition format: {condition}"}
            elif '"' in condition:
                parts = condition.split('"')
                if len(parts) > 1:
                    search_term = parts[1]
                else:
                    return {'summary': f"Invalid condition format: {condition}"}
            else:
                return {'summary': f"Condition must contain quotes for 'contains': {condition}"}
            self.df = self.df[self.df[column].astype(str).str.contains(search_term, na=False)]
        elif '>=' in condition:
            try:
                value = float(condition.split('>=')[1].strip())
            except ValueError:
                return {'summary': f"Invalid value for condition: {condition}. Could not parse a number after '>='."}
            self.df = self.df[self.df[column] >= value]
        elif '<=' in condition:
            try:
                value = float(condition.split('<=')[1].strip())
            except ValueError:
                return {'summary': f"Invalid value for condition: {condition}. Could not parse a number after '<='."}
            self.df = self.df[self.df[column] <= value]
        elif '>' in condition:
            try:
                value = float(condition.split('>')[1].strip())
            except ValueError:
                return {'summary': f"Invalid value for condition: {condition}. Could not parse a number after '>'."}
            self.df = self.df[self.df[column] > value]
        elif '<' in condition:
            try:
                value = float(condition.split('<')[1].strip())
            except ValueError:
                return {'summary': f"Invalid value for condition: {condition}. Could not parse a number after '<'."}
            self.df = self.df[self.df[column] < value]
        elif '==' in condition:
            value = condition.split('==')[1].strip().strip("'\"")
            self.df = self.df[self.df[column] == value]
        
        filtered = initial_count - len(self.df)
        return {'summary': f'Filtered {filtered} rows based on {column} {condition}'}
    
    def _execute_sort_values(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Sort DataFrame by columns"""
        columns = params['columns']
        ascending = params.get('ascending', True)
        
        if isinstance(columns, str):
            columns = [columns]
        
        self.df = self.df.sort_values(by=columns, ascending=ascending)
        return {'summary': f'Sorted by {", ".join(columns)}'}
    
    def _execute_replace_value(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Replace values in DataFrame"""
        old_value = params['old_value']
        new_value = params['new_value']
        column = params.get('column', None)
        
        if column:
            if column in self.df.columns:
                self.df[column] = self.df[column].replace(old_value, new_value)
                return {'summary': f'Replaced "{old_value}" with "{new_value}" in column {column}'}
            return {'summary': f'Column {column} not found'}
        else:
            self.df = self.df.replace(old_value, new_value)
            return {'summary': f'Replaced "{old_value}" with "{new_value}" in all columns'}
    
    def _execute_change_type(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Change column data type"""
        column = params['column']
        new_type = params['type']
        
        if column not in self.df.columns:
            return {'summary': f'Column {column} not found'}
        
        try:
            if new_type == 'int':
                self.df[column] = pd.to_numeric(self.df[column], errors='coerce').astype('Int64')
            elif new_type == 'float':
                self.df[column] = pd.to_numeric(self.df[column], errors='coerce')
            elif new_type == 'str':
                self.df[column] = self.df[column].astype(str)
            elif new_type == 'datetime':
                self.df[column] = pd.to_datetime(self.df[column], errors='coerce')
            
            return {'summary': f'Changed {column} to {new_type}'}
        except Exception as e:
            return {'summary': f'Error changing type: {str(e)}'}
    
    def _execute_trim_whitespace(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Trim whitespace from string columns"""
        columns = params.get('columns', None)
        
        if columns:
            for col in columns:
                if col in self.df.columns:
                    self.df[col] = self.df[col].astype(str).str.strip()
        else:
            # Trim all string columns
            for col in self.df.select_dtypes(include=['object']).columns:
                self.df[col] = self.df[col].astype(str).str.strip()
        
        return {'summary': 'Trimmed whitespace from text columns'}
    
    def _execute_upper_case(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Convert text to uppercase"""
        column = params['column']
        if column in self.df.columns:
            self.df[column] = self.df[column].astype(str).str.upper()
            return {'summary': f'Converted {column} to uppercase'}
        return {'summary': f'Column {column} not found'}
    
    def _execute_lower_case(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Convert text to lowercase"""
        column = params['column']
        if column in self.df.columns:
            self.df[column] = self.df[column].astype(str).str.lower()
            return {'summary': f'Converted {column} to lowercase'}
        return {'summary': f'Column {column} not found'}
    
    def _execute_capitalize(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Capitalize text"""
        column = params['column']
        if column in self.df.columns:
            self.df[column] = self.df[column].astype(str).str.capitalize()
            return {'summary': f'Capitalized {column}'}
        return {'summary': f'Column {column} not found'}
    
    def _execute_round_numbers(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Round numeric columns"""
        column = params['column']
        decimals = params.get('decimals', 2)
        
        if column in self.df.columns:
            self.df[column] = self.df[column].round(decimals)
            return {'summary': f'Rounded {column} to {decimals} decimals'}
        return {'summary': f'Column {column} not found'}
    
    def _execute_drop_empty_rows(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Drop rows that are completely empty"""
        initial_count = len(self.df)
        self.df = self.df.dropna(how='all')
        removed = initial_count - len(self.df)
        return {'summary': f'Removed {removed} empty rows'}
    
    def _execute_drop_empty_columns(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Drop columns that are completely empty"""
        initial_cols = len(self.df.columns)
        self.df = self.df.dropna(axis=1, how='all')
        removed = initial_cols - len(self.df.columns)
        return {'summary': f'Removed {removed} empty columns'}
    
    def get_preview(self, n_rows: int = 5) -> List[Dict[str, Any]]:
        """Get first N rows as preview"""
        preview_df = self.df.head(n_rows).copy()
        
        # Handle NaT values in datetime columns first
        for col in preview_df.columns:
            if pd.api.types.is_datetime64_any_dtype(preview_df[col]):
                # Replace NaT with None for datetime columns
                preview_df[col] = preview_df[col].where(preview_df[col].notna(), None)
        
        # Handle other NaN values
        preview_df = preview_df.fillna("")
        
        # Convert to records with proper serialization
        records = []
        for _, row in preview_df.iterrows():
            record = {}
            for col, value in row.items():
                if pd.isna(value) or value is pd.NaT:
                    record[col] = None
                elif isinstance(value, (pd.Timestamp, np.datetime64)):
                    record[col] = str(value) if pd.notna(value) else None
                else:
                    record[col] = value
            records.append(record)
        
        return records
    
    def save_to_file(self, output_path: str, sheet_name: Optional[str] = None) -> str:
        """Save DataFrame to Excel file"""
        if sheet_name is None:
            sheet_name = self.sheet_name
        
        # If file already exists, try to preserve other sheets
        if os.path.exists(output_path):
            try:
                with pd.ExcelFile(output_path) as xls:
                    sheets_dict = {name: pd.read_excel(xls, name) for name in xls.sheet_names}
                    sheets_dict[sheet_name] = self.df
                
                with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
                    for name, df in sheets_dict.items():
                        df.to_excel(writer, sheet_name=name, index=False)
            except:
                # If error, just save current sheet
                self.df.to_excel(output_path, sheet_name=sheet_name, index=False)
        else:
            self.df.to_excel(output_path, sheet_name=sheet_name, index=False)
        
        return output_path
    
    def get_stats(self) -> Dict[str, Any]:
        """Get DataFrame statistics"""
        return {
            'rows': len(self.df),
            'columns': len(self.df.columns),
            'column_names': list(self.df.columns),
            'null_counts': self.df.isnull().sum().to_dict()
        }
