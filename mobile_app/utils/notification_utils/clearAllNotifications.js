import * as Notifications from "expo-notifications";

const clearAllNotifications = async () => {
    console.log("[NotificationsCleaner] Clearing all notifications")
    // Clear all scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync()

    // Dismiss all old notifications from Notifications Center (notifications tray)
    await Notifications.dismissAllNotificationsAsync()
}


export default clearAllNotifications