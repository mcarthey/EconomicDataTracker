namespace EconomicDataTracker.Common.Logging
{
    public class Logger
    {
        private readonly string _connectionString;

        public Logger(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void LogInfo(string message)
        {
            LogToDatabase("Info", message);
        }

        public void LogWarning(string message)
        {
            LogToDatabase("Warning", message);
        }

        public void LogError(string message, Exception exception = null)
        {
            var fullMessage = $"{message}{(exception != null ? " - Exception: " + exception.Message : "")}";
            LogToDatabase("Error", fullMessage);
        }

        private void LogToDatabase(string level, string message)
        {
            // Code to insert log into the database table
        }
    }
}
