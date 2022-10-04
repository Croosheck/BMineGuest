import Constants from "expo-constants";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps } from "firebase/app";
import {
	initializeAuth,
	getReactNativePersistence,
} from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: Constants.manifest.extra.apiKey,
	authDomain: Constants.manifest.extra.authDomain,
	projectId: Constants.manifest.extra.projectId,
	storageBucket: Constants.manifest.extra.storageBucket,
	messagingSenderId: Constants.manifest.extra.messagingSenderId,
	appId: Constants.manifest.extra.appId,
};

let app;
let auth;
let db;
let storage;

if (!getApps().length) {
	app = initializeApp(firebaseConfig);
	auth = initializeAuth(app, {
		persistence: getReactNativePersistence(AsyncStorage),
	});
	db = getFirestore(app);
	storage = getStorage(app);
}

export { auth, db, storage };
