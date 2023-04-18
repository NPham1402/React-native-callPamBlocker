package com.callspamblocker;

import android.os.Build;
import android.provider.BlockedNumberContract;
import android.telecom.Call;
import android.telecom.CallScreeningService;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

@RequiresApi(api = Build.VERSION_CODES.N)
public class CallScreenServiceClass extends CallScreeningService {
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

        return phoneNumber.equals("1234567890") || phoneNumber.equals("5555555555");
    }
}
