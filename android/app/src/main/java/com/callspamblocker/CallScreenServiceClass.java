package com.callspamblocker;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.provider.BlockedNumberContract;
import android.telecom.Call;
import android.telecom.CallScreeningService;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
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

    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager
                = (ConnectivityManager) getSystemService(this.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager != null ? connectivityManager.getActiveNetworkInfo() : null;
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    private void notificationShow(String message,String title){
        if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED) {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setSmallIcon(R.drawable.logo)
                    .setContentTitle(title)
                    .setContentText(message)
                    .setStyle(new NotificationCompat.BigTextStyle()
                            .bigText(message))
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT);
            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
            notificationManager.notify(getID(), builder.build());

        }
    }

    private DatabaseHandler databaseHandler=new DatabaseHandler(this);



    @Override
    public void onScreenCall(@NonNull Call.Details callDetails) {
        String phoneNumber = callDetails.getHandle().getSchemeSpecificPart();

        // Check if the phone number is in a blacklist or matches some criteria
        if (isBlocked(phoneNumber)) {

            // Reject the call and disconnect it
            respondToCall(callDetails, new CallResponse.Builder()
                    .setDisallowCall(true)
                    .setRejectCall(true)
                    .build());

            notificationShow("The "+phoneNumber+" is blocked by CallSpamBlocker","Block call");

        } else {
            if(isNetworkAvailable()==true){

            RequestQueue queue = Volley.newRequestQueue(this);
            String url = "https://api.call-spam-blocker.xyz/phone-numbers/" + phoneNumber + "/incoming-call";

            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                    (Request.Method.GET, url, null, new Response.Listener<JSONObject>() {

                        @Override
                        public void onResponse(JSONObject response) {
                            try {
                                int result=  response.getInt("result");
                                Log.e("erhgsahgsahg",result+"");                              if(result!=2){
                                    // Allow the call to continue normally
                                    if(result==1){
                                        notificationShow("This "+phoneNumber+" may be a spammer and is being tracked. If it is a problem please report it to us. Thank you. ","Warn ");
                                    }
                                    respondToCall(callDetails, new CallResponse.Builder()
                                            .setDisallowCall(false)
                                            .setRejectCall(false)
                                            .build());
                                }
                                else{

                                    // Reject the call and disconnect it
                                    respondToCall(callDetails, new CallResponse.Builder()
                                            .setDisallowCall(true)
                                            .setRejectCall(true)
                                            .build());
                                    notificationShow("The "+phoneNumber+" is blocked by CallSpamBlocker","Block call");
                                }
                            } catch (JSONException e) {

                                throw new RuntimeException(e);
                            }
                        }
                    }, new Response.ErrorListener() {

                        @Override
                        public void onErrorResponse(VolleyError error) {

                        }
                    }){
                @Override
                protected Response<JSONObject> parseNetworkResponse(NetworkResponse response) {
                    return super.parseNetworkResponse(response);
                }

                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    Map<String, String>  params = new HashMap<>();
                    params.put("authorization", "spambl0ckerAuthorization2k1rbyp0wer");
                    return params;
                }
            };
            queue.add(jsonObjectRequest);
            }
            else{
                databaseHandler.addWattingLine(phoneNumber);
                respondToCall(callDetails, new CallResponse.Builder()
                        .setDisallowCall(false)
                        .setRejectCall(false)
                        .build());
            }
        }

    }
    private boolean isBlocked(String phoneNumber) {
        // You can implement your own logic here, such as querying a database or a shared preference
        // For simplicity, we just hardcode some blocked numbers

        return  databaseHandler.checkStudent(phoneNumber);
    }
}
