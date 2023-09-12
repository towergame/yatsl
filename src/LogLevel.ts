/**
 * Enum containing the log levels used by the Logger.
 *
 * Levels are based on the levels of severity, which are lifted off of https://datatracker.ietf.org/doc/html/rfc5424#section-3
 */
export enum LogLevel {
    /**
     * System is unstable
     */
    EMERGENCY,
    /**
     * Action must be taken immediately
     */
    ALERT,
    /**
     * Critical conditions
     */
    CRITICAL,
    /**
     * Error conditions
     */
    ERROR,
    /**
     * Warning conditions
     */
    WARNING,
    /**
     * Normal, significant conditions
     */
    NOTICE,
    /**
     * Informational messages
     */
    INFO,
    /**
     * Debug messages
     */
    DEBUG
}