// import React, { useEffect } from "react";
// import { collection, onSnapshot, query } from "firebase/firestore";
// import { db } from "../firebase";
// import { useDispatch } from "react-redux";
// import { realTimeRestaurants } from "../redux/slices/user";

// const FirestoreListener = () => {
// 	const dispatch = useDispatch;

// 	let availableRestaurants;

// 	useEffect(() => {
// 		const q = query(collection(db, "restaurants"));

// 		const unsubscribe = onSnapshot(q, (querySnapshot) => {
// 			availableRestaurants = [];

// 			querySnapshot.forEach((doc) => {
// 				availableRestaurants.push(doc.data());
// 			});

// 			dispatch(realTimeRestaurants(availableRestaurants));
// 		});
// 	}, [availableRestaurants]);

// 	return <></>;
// };

// export default FirestoreListener;
