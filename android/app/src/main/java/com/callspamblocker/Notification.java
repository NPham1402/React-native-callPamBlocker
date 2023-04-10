package com.callspamblocker;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

public class Notification extends ReactContextBaseJavaModule {

    Notification(ReactApplicationContext context) {
        super(context);
    }
 @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return super.getConstants();
    }
    @ReactMethod
    public void Show(String note){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Call Spam Blocker";
            String description = "Call Spam Blocker";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel("0e070d48982284dccca288be056997b7", name, importance);
            channel.setDescription(description);
            // Register the channel with the system. You can't change the importance
            // or other notification behaviors after this.
            NotificationManager notificationManager = ContextCompat.getSystemService(getReactApplicationContext(),NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
        NotificationCompat.Builder builder = new NotificationCompat.Builder(getReactApplicationContext(),"0e070d48982284dccca288be056997b7")
                .setSmallIcon(R.drawable.baseline_notifications_24)
                .setContentTitle("Call Spam Blocker")
                .setContentText(note)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getReactApplicationContext());
        Toast.makeText(getReactApplicationContext(),"Check",1).show();
// notificationId is a unique int for each notification that you must define
        notificationManager.notify(14022001, builder.build());
    }

    @NonNull
    @Override
    public String getName() {
        return "Notification";
    }
}
