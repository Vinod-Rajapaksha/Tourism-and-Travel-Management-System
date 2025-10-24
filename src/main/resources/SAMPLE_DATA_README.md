# Sample Data Generation for New Users

This feature automatically adds sample completed tours for new users when they register.

## How It Works

When a new user (customer or guide) registers:
1. The system automatically creates 2-3 sample completed tours
2. Tours are assigned random completion dates (7-90 days ago)
3. Tours use existing guides, customers, and packages
4. All tours are marked as "COMPLETED" status

## Configuration

You can configure this feature in `application.properties`:

```properties
# Enable/disable sample data generation
ttms.sample-data.enabled=true

# Number of tours per customer (2-3 tours)
ttms.sample-data.min-tours-per-customer=2
ttms.sample-data.max-tours-per-customer=3

# Number of tours per guide (1-2 tours)
ttms.sample-data.min-tours-per-guide=1
ttms.sample-data.max-tours-per-guide=2

# Tour completion date range (7-90 days ago)
ttms.sample-data.min-days-ago=7
ttms.sample-data.max-days-ago=90
```

## Benefits

1. **Immediate Dashboard Data**: New users see completed tours in their dashboard
2. **Feedback System**: Users can immediately test the feedback functionality
3. **Realistic Testing**: More realistic data for testing the application
4. **Better User Experience**: Users don't start with empty dashboards

## Disabling the Feature

To disable sample data generation, set:
```properties
ttms.sample-data.enabled=false
```

## Requirements

For this feature to work properly, you need:
- At least one guide in the database
- At least one package in the database
- At least one customer in the database (for guide tours)

## Error Handling

If sample data generation fails:
- The error is logged but doesn't prevent user registration
- The user is still created successfully
- The system continues to work normally
