from datetime import datetime

class DataProcessor:
    def __init__(self, data):
        self.data = data

    def get_max_value(self):
        max_record = None
        for record in self.data:
            if max_record is None or record['value'] > max_record['value']:
                max_record = record
        return max_record

    def get_average_value(self):
        total = 0
        count = 0
        for record in self.data:
            total += record['value']
            count += 1
        return total / count if count != 0 else 0

    def filter_records(self, threshold):
        filtered = []
        for record in self.data:
            if record['value'] >= threshold:
                filtered.append(record)
        return filtered

    def sort_by_timestamp(self):
        return sorted(self.data, key=lambda x: datetime.strptime(x['timestamp'], '%Y-%m-%dT%H:%M:%SZ'))

    def normalize_values(self):
        if not self.data:
            return self.data
        min_value = min(record['value'] for record in self.data)
        max_value = max(record['value'] for record in self.data)
        for record in self.data:
            record['value'] = (record['value'] - min_value) / (max_value - min_value) if max_value != min_value else 0.5
        return self.data

# Sample data
data = [
    {'id': 1, 'value': 10, 'timestamp': '2024-01-01T10:00:00Z'},
    {'id': 2, 'value': 20, 'timestamp': '2024-01-02T11:00:00Z'},
    {'id': 3, 'value': 15, 'timestamp': '2024-01-03T12:00:00Z'},
]

# Test cases
processor = DataProcessor(data)
print(processor.get_max_value())        # Expected output: {'id': 2, 'value': 20, 'timestamp': '2024-01-02T11:00:00Z'}
print(processor.get_average_value())    # Expected output: 15.0
print(processor.filter_records(15))     # Expected output: [{'id': 2, 'value': 20, 'timestamp': '2024-01-02T11:00:00Z'}, {'id': 3, 'value': 15, 'timestamp': '2024-01-03T12:00:00Z'}]
print(processor.sort_by_timestamp())    # Expected output: Sorted list by timestamp
print(processor.normalize_values())     # Expected output: [{'id': 1, 'value': 0.0, 'timestamp': '2024-01-01T10:00:00Z'}, {'id': 2, 'value': 1.0, 'timestamp': '2024-01-02T11:00:00Z'}, {'id': 3, 'value': 0.5, 'timestamp': '2024-01-03T12:00:00Z'}]