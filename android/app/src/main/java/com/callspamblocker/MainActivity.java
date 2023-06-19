package com.callspamblocker;


import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.role.RoleManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.telecom.TelecomManager;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {
    private final int REQUEST_CODE_SET_DEFAULT_DIALER = 123;
    SharePreferances pref;
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
   @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
    pref=new SharePreferances(getBaseContext());

       if(!pref.pref.contains("create")){
           pref.setVariableDefault();
       }
       else{
           Log.e("ssdjdnfjad",           pref.getAll());
       }
   }

  @Override
  protected String getMainComponentName() {
    return "callSpamBlocker";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {


    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }


    private static final String[] PERMISSIONS = {
            android.Manifest.permission.MANAGE_OWN_CALLS,
            android.Manifest.permission.READ_PHONE_STATE,
            android.Manifest.permission.CALL_PHONE, Manifest.permission.READ_CALL_LOG
    };
    private static final int PERMISSION_REQUEST_CODE = 1000;
    private boolean hasPermissions() {
        for (String permission : PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    // Request the permissions if you don't have them
    private void requestPermissions() {
        ActivityCompat.requestPermissions(this, PERMISSIONS, PERMISSION_REQUEST_CODE);
    }

    @Override
    protected void onStart() {



        super.onStart();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == REQUEST_CODE_SET_DEFAULT_DIALER){
            checkSetDefaultDialerResult(resultCode);
        }
    }

    private void checkSetDefaultDialerResult(int resultCode){
        String message;
        switch (resultCode){
            case RESULT_OK:message = "User accepted request to become default dialer";break;
            case RESULT_CANCELED:message = "User declined request to become default dialer";break;
            default:message = "Unexpected result code: " + resultCode;break;
        }
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
}
