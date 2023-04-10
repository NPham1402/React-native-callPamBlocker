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
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {
    private final int REQUEST_CODE_SET_DEFAULT_DIALER = 123;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
   @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);


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

    private void checkDefaultDialer() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return;

        TelecomManager telecomManager = (TelecomManager) getSystemService(TELECOM_SERVICE);
        boolean isAlreadyDefaultDialer = this.getPackageName().equals(telecomManager.getDefaultDialerPackage());
        if (!isAlreadyDefaultDialer) {

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                RoleManager roleManager = (RoleManager) getSystemService(Context.ROLE_SERVICE);
                // Check if the dialer role is available on the device
                if (roleManager.isRoleAvailable(RoleManager.ROLE_DIALER)) {
                    // Create an intent to request the dialer role

                    Intent intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_DIALER);
                    // Start the activity for result with a request code
                    startActivityForResult(intent, REQUEST_CODE_SET_DEFAULT_DIALER);
                }
            }
            else {
                Intent intent = (new Intent(TelecomManager.ACTION_CHANGE_DEFAULT_DIALER))
                        .putExtra(TelecomManager.EXTRA_CHANGE_DEFAULT_DIALER_PACKAGE_NAME, this.getPackageName());
                this.startActivityForResult(intent, REQUEST_CODE_SET_DEFAULT_DIALER);
            }}
    }

    @Override
    protected void onStart() {
        super.onStart();
        String CHANNEL_ID = "callspamblocker";
        CharSequence name = "The Call Spam Blocker";
        int importance = NotificationManager.IMPORTANCE_DEFAULT;
        NotificationChannel channel = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            channel = new NotificationChannel(CHANNEL_ID, name, importance);
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
        checkDefaultDialer();
    }
    public void checkPermission(String permission, int requestCode)
    {
        // Checking if permission is not granted
        if (ContextCompat.checkSelfPermission(MainActivity.this, permission) == PackageManager.PERMISSION_DENIED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[] { permission }, requestCode);
        }
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
