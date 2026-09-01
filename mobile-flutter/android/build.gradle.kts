allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}
subprojects {
    fun configureAndroid(proj: Project) {
        if (proj.hasProperty("android")) {
            val android = proj.extensions.findByName("android")
            if (android != null) {
                try {
                    android.javaClass.getMethod("compileSdkVersion", Int::class.javaPrimitiveType).invoke(android, 36)
                } catch (e: Exception) {
                    try {
                        android.javaClass.getMethod("setCompileSdkVersion", Int::class.javaPrimitiveType).invoke(android, 36)
                    } catch (e2: Exception) {}
                }
                try {
                    val defaultConfig = android.javaClass.getMethod("getDefaultConfig").invoke(android)
                    defaultConfig.javaClass.getMethod("targetSdkVersion", Int::class.javaPrimitiveType).invoke(defaultConfig, 36)
                } catch (e: Exception) {
                    try {
                        val defaultConfig = android.javaClass.getMethod("getDefaultConfig").invoke(android)
                        defaultConfig.javaClass.getMethod("setTargetSdkVersion", Int::class.javaPrimitiveType).invoke(defaultConfig, 36)
                    } catch (e2: Exception) {}
                }
            }
        }
    }

    if (project.state.executed) {
        configureAndroid(project)
    } else {
        project.afterEvaluate {
            configureAndroid(project)
        }
    }
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
