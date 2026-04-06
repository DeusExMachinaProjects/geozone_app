package com.geozone.tracking

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class TrackingForegroundPackage : BaseReactPackage() {

    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext,
    ): NativeModule? {
        return if (name == TrackingForegroundModule.NAME) {
            TrackingForegroundModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                TrackingForegroundModule.NAME to ReactModuleInfo(
                    name = TrackingForegroundModule.NAME,
                    className = TrackingForegroundModule::class.java.name,
                    canOverrideExistingModule = false,
                    needsEagerInit = false,
                    isCxxModule = false,
                    isTurboModule = false,
                ),
            )
        }
    }
}