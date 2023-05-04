package com.callspamblocker;


import static android.content.Context.ROLE_SERVICE;
import static androidx.core.content.ContextCompat.getSystemService;

import android.annotation.SuppressLint;
import android.app.role.RoleManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.CallLog;
import android.provider.ContactsContract;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class ControlPhone extends ReactContextBaseJavaModule {
    private DatabaseHandler databaseHandler=new DatabaseHandler(getReactApplicationContext());

    String CHANNEL_ID = "543336856";
    private final static AtomicInteger c = new AtomicInteger(0);

    public static int getID() {
        return c.incrementAndGet();
    }


    ControlPhone(ReactApplicationContext context) {
        super(context);

    }


    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return super.getConstants();
    }

    @ReactMethod
    public void toastTest(String TestA, int durantion) {
        Toast.makeText(getReactApplicationContext(), TestA, durantion).show();
    }

    @ReactMethod
    public void startCall(String numberPhone) {
        Intent callIntent = new Intent(Intent.ACTION_CALL);
        callIntent.setData(Uri.parse("tel:" + numberPhone));
        callIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(callIntent);

    }

    @ReactMethod
    public void getANumberPhone(Promise promise) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            TelephonyManager tm = (TelephonyManager)
                    getReactApplicationContext().getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
            String telNumber = tm.getLine1Number();
            promise.resolve(telNumber);
        }

    }

    @ReactMethod
        public void getIdDevice(Promise promise) {
        String android_id = Settings.Secure.getString(getReactApplicationContext().getContentResolver(),Settings.Secure.ANDROID_ID);
            promise.resolve(android_id);
    }
    @ReactMethod
    public void openContactDetail(String contactID) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        Uri uri = Uri.withAppendedPath(ContactsContract.Contacts.CONTENT_URI,
                String.valueOf(contactID));
        intent.setData(uri);
        getReactApplicationContext().startActivity(intent);
    }
   @ReactMethod
    public void getAllBlockPhones(Promise promise) {
    promise.resolve(databaseHandler.getAllBlockPhone().toString());

   }
    @ReactMethod
    public void openPermission() {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        Uri uri = Uri.fromParts("package",getReactApplicationContext().getPackageName() , null);
        intent.setData(uri);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(intent);
    }
    @ReactMethod
    public void requestBlock() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            RoleManager roleManager = (RoleManager)  getReactApplicationContext().getSystemService(ROLE_SERVICE);
            Intent intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING);
         getCurrentActivity().startActivityForResult(intent, 4544); // 1 is an arbitrary request code
        }
    }

    @ReactMethod
    public void checkRequestBlock(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            RoleManager roleManager = (RoleManager) getReactApplicationContext().getSystemService(ROLE_SERVICE);
            if (roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
                promise.resolve(true);
            } else {
                promise.resolve(false);
            }
        }

    }


    @ReactMethod
    public void getAllHistoryBlock(Promise promise) {
        try {
            promise.resolve(databaseHandler.getAllHistory().toString());
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

    }


    @ReactMethod
    public void getHistoryBlockPhones(String  Phone, Promise promise) {
            promise.resolve(databaseHandler.getAllPhoneHistoryBlocked(Phone).toString());

    }
    @ReactMethod
    public void addNotification(String title,String content) {
        if (ActivityCompat.checkSelfPermission(getReactApplicationContext(), android.Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED) {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(getReactApplicationContext(), CHANNEL_ID)
                    .setSmallIcon(R.drawable.baseline_notifications_24)
                    .setContentTitle(title)
                    .setContentText(content)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT);
            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getReactApplicationContext());
            notificationManager.notify(getID(), builder.build());
        }
    }

    @ReactMethod
    public void addBlockPhone(String id, String name,String phone) {
        databaseHandler.addBlockPhone(id,name,phone);
    }
    @ReactMethod
    public void unBlockPhone(String id) {
        databaseHandler.unBlockPhone(id);
    }


    @ReactMethod
    public void getHistoryCall(Promise promise) throws JSONException {
        JSONArray calls=new JSONArray();
        Uri uri =Uri.parse("content://call_log/calls");
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            Cursor cursorLog= getReactApplicationContext().getContentResolver().query(uri,null,null,null);
            cursorLog.moveToFirst();
            do {
                JSONObject Call=new JSONObject();
                @SuppressLint("Range") String number=cursorLog.getString(cursorLog.getColumnIndex(CallLog.Calls.NUMBER));
                @SuppressLint("Range") String name=cursorLog.getString(cursorLog.getColumnIndex(CallLog.Calls.CACHED_NAME));
                @SuppressLint("Range") String duration=cursorLog.getString(cursorLog.getColumnIndex(CallLog.Calls.DURATION));
                @SuppressLint("Range") String type=cursorLog.getString(cursorLog.getColumnIndex(CallLog.Calls.TYPE));
                @SuppressLint("Range") String date=cursorLog.getString(cursorLog.getColumnIndex(CallLog.Calls.DATE));

                try {
                    Call.put("Name",name);
                    Call.put("Number",number);
                    Call.put("Duration",duration);
                    Call.put("Type",type);
                    Call.put("Date",date);
                    calls.put(Call);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            }
            while (cursorLog.moveToNext());
        }
        JSONObject object=new JSONObject();
        object.put("call",calls);
        promise.resolve(object.toString());
    }
    @ReactMethod
    public  void getContactRowIDLookupList(String contactNo,Promise promise) {

        String contactNumber = Uri.encode(contactNo);
        String contactIdList = new String();
        if (contactNumber != null) {
            Cursor contactLookupCursor = getReactApplicationContext().getContentResolver().query(
                    Uri.withAppendedPath(ContactsContract.PhoneLookup.CONTENT_FILTER_URI,
                            Uri.encode(contactNumber)),
                    new String[] { ContactsContract.PhoneLookup.DISPLAY_NAME, ContactsContract.PhoneLookup.CONTACT_ID },
                    null, null, null);
            if (contactLookupCursor != null) {
                while (contactLookupCursor.moveToNext()) {
                    int phoneContactID = contactLookupCursor
                            .getInt(contactLookupCursor
                                    .getColumnIndexOrThrow(ContactsContract.PhoneLookup.CONTACT_ID));
                    if (phoneContactID > 0) {
                        contactIdList += "'" + phoneContactID + "',";
                    }
                }
                if (contactIdList.endsWith(",")) {
                    contactIdList = contactIdList.substring(0,
                            contactIdList.length() - 1);
                }
            }
            contactLookupCursor.close();
        }
        promise.resolve(contactIdList.toString()    );
    }

    @NonNull
    @Override
    public String getName() {
        return "ControlPhone";
    }

}