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
	apiKey: Constants.expoConfig.extra.apiKey,
	authDomain: Constants.expoConfig.extra.authDomain,
	projectId: Constants.expoConfig.extra.projectId,
	storageBucket: Constants.expoConfig.extra.storageBucket,
	messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
	appId: Constants.expoConfig.extra.appId,
	// apiKey: "AIzaSyBiahlKIrbCBvdLpObk2LTADtvxCDL3-Kw",
	// authDomain: "bmineguest.firebaseapp.com",
	// projectId: "bmineguest",
	// storageBucket: "bmineguest.appspot.com",
	// messagingSenderId: "1078589199636",
	// appId: "1:1078589199636:web:e08e61fa957bd9b1149e01",
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
