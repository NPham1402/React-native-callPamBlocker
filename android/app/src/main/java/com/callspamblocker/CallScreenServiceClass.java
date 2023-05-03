package com.callspamblocker;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.BlockedNumberContract;
import android.telecom.Call;
import android.telecom.CallScreeningService;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.util.concurrent.atomic.AtomicInteger;

@RequiresApi(api = Build.VERSION_CODES.N)
public class CallScreenServiceClass extends CallScreeningService {
    String CHANNEL_ID = "543336856";
    private final static AtomicInteger c = new AtomicInteger(0);

    public static int getID() {
        return c.incrementAndGet();
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "CallSpamBlocker";
            String description = "Call Spam Blocker";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
    private DatabaseHandler databaseHandler=new DatabaseHandler(this);
    @Override
    public void onScreenCall(@NonNull Call.Details callDetails) {
        String phoneNumber = callDetails.getHandle().getSchemeSpecificPart();

        // Check if the phone number is in a blacklist or matches some criteria
        if (isBlocked(phoneNumber)) {

            databaseHandler.addBlockHistory(phoneNumber);

            // Reject the call and disconnect it
            respondToCall(callDetails, new CallResponse.Builder()
                    .setDisallowCall(true)
                    .setRejectCall(true)
                    .build());

            if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED) {
                NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                        .setSmallIcon(R.drawable.baseline_notifications_24)
                        .setContentTitle("Block Call")
                        .setContentText("The "+phoneNumber+" is blocked by CallSpamBlocker")
                        .setStyle(new NotificationCompat.BigTextStyle()
                                .bigText("Much longer text that cannot fit one line..."))
                        .setPriority(NotificationCompat.PRIORITY_DEFAULT);
                NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
                notificationManager.notify(getID(), builder.build());

            }

        } else {
            // Allow the call to continue normally
            respondToCall(callDetails, new CallResponse.Builder()
                    .setDisallowCall(false)
                    .setRejectCall(false)
                    .build());
        }

    }
    private boolean isBlocked(String phoneNumber) {
        // You can implement your own logic here, such as querying a database or a shared preference
        // For simplicity, we just hardcode some blocked numbers

        return  databaseHandler.checkStudent(phoneNumber);
    }
}
