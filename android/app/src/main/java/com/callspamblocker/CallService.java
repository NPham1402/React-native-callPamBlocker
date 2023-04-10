package com.callspamblocker;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.telecom.Call;
import android.telecom.InCallService;
import android.util.Log;
import android.view.View;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

@RequiresApi(api = Build.VERSION_CODES.M)
public class CallService extends InCallService {

    @Override
    public void onCallAdded(Call call) {
        super.onCallAdded(call);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            call.registerCallback(callCallback);
        }
        Intent intent = new Intent(getApplicationContext(), CallActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        CallManager.updateCall(call);
    }

    @Override
    public void onCallRemoved(Call call) {
        super.onCallRemoved(call);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            call.unregisterCallback(callCallback);
        }
        CallManager.updateCall(null);
        Intent intent = new Intent(getApplicationContext(), MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);


    }
    private void notificationShow(){
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "callspamblockerssssss")
                .setSmallIcon(R.drawable.baseline_notifications_24)
                .setContentTitle("My notification")
                .setContentText("Hello World!")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);


        Log.e("Check","noti");
        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://www.google.com"));
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, browserIntent, 0);
        builder.setContentIntent(pendingIntent);
        NotificationManager notificationManager = getSystemService(NotificationManager.class);
        notificationManager.notify(View.generateViewId(), builder.build());
    }
    private Call.Callback callCallback = new Call.Callback() {
        @Override
        public void onStateChanged(Call call, int state) {
            Log.e("Check",call.getState()+"");
            CallManager.updateCall(call);
        }
    };
}
