package com.callspamblocker;

import android.os.Build;
import android.telecom.Call;

import org.jetbrains.annotations.Nullable;

import io.reactivex.Observable;
import io.reactivex.subjects.BehaviorSubject;

public class CallManager {

    private static BehaviorSubject subject;
    private static Call currentCall = null;
    public static CallManager INSTANCE;

    public static Observable updates() {
        BehaviorSubject behaviorSubject = subject;
        return (Observable)behaviorSubject;
    }

    public static void updateCall(@Nullable Call call) {
        currentCall = call;
        if(call!=null){

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (call.getState() != Call.STATE_DISCONNECTED) {
                    subject.onNext(MappersJava.toGsmCall(call));
                }
            }
        }

    }

    public static void cancelCall() {
        Call call = currentCall;
        if (call != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (call.getState() == Call.STATE_RINGING) {
                    INSTANCE.rejectCall();
                } else {
                    INSTANCE.disconnectCall();
                }
            }
        }

    }

    public static void acceptCall() {
        Call call = currentCall;
        if (call != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                call.answer(call.getDetails().getVideoState());
            }
        }

    }

    private static void rejectCall() {
        Call call = currentCall;
        if (call != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                call.reject(false, "");
            }
            currentCall=null;

        }

    }

    private static void disconnectCall() {
        Call call = currentCall;
        if (call != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                call.disconnect();
            }
            currentCall=null;
        }

    }

    static {
        CallManager var0 = new CallManager();
        INSTANCE = var0;
        subject = BehaviorSubject.create();
    }
}
