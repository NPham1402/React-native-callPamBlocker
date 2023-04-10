package com.callspamblocker;


import static androidx.core.content.ContextCompat.getSystemService;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.provider.CallLog;
import android.telephony.TelephonyManager;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;

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

import java.util.Map;
import java.util.HashMap;

public class ControlPhone extends ReactContextBaseJavaModule {
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
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            TelephonyManager tm = (TelephonyManager)
                    getReactApplicationContext().getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
        }
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
    public void getAIMEI(Promise promise) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            TelephonyManager tm = (TelephonyManager)
                    getReactApplicationContext().getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
            String IMEI = tm.getDeviceId();
                  promise.resolve(IMEI);
        }
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

                try {
                    Call.put("Name",name);
                    Call.put("Number",number);
                    Call.put("Duration",duration);
                    Call.put("Type",type);
                    calls.put(Call);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            }
            while (cursorLog.moveToNext());
        }
        JSONObject object=new JSONObject();
        object.put("Calls",calls);
        promise.resolve(object.toString());
    }

    @NonNull
    @Override
    public String getName() {
        return "ControlPhone";
    }

}
