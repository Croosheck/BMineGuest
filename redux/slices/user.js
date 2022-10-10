import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";

import { RESTAURANTS } from "../../util/restaurants";

export const getUser = createAsyncThunk("user/getUser", async () => {
	const docRef = doc(db, "users", auth.currentUser.uid);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const { email, name, registrationTimestamp, lastTimeLoggedIn } =
			docSnap.data();

		return { email, name };
	}
});

const restaurants = RESTAURANTS;

export const userSlice = createSlice({
	name: "user",
	initialState: {
		currentUser: "",
		reservationData: {
			extras: [],
			table: [],
		},
		reservationDate: "",
		availableRestaurants: restaurants,
	},
	reducers: {
		addTable: (state, { payload }) => {
			state.reservationData = { ...state.reservationData, ...payload };
		},
		addExtra: (state, { payload }) => {
			state.reservationData = {
				...state.reservationData,
				extras: [...state.reservationData.extras, { ...payload }],
			};
		},
		removeExtra: (state, { payload }) => {
			const filteredExtras = state.reservationData.extras.filter(
				(item) => item.xName !== payload
			);

			state.reservationData = {
				...state.reservationData,
				extras: filteredExtras,
			};
		},
		pickDate: (state, { payload }) => {
			state.reservationDate = payload;
		},
		clearDate: (state) => {
			state.reservationDate = "";
		},
		logoutUser: (state) => {
			state.currentUser = "";
		},
		tablePicked: (state, { payload }) => {
			const pickedRestaurantIndex = state.availableRestaurants.findIndex(
				(restaurant) => restaurant.key === payload.key
			);

			state.availableRestaurants[pickedRestaurantIndex].tables.map(
				(table) => (table.tPicked = false)
			);

			state.availableRestaurants[pickedRestaurantIndex].tables[
				payload.tableIndex
			].tPicked =
				!state.availableRestaurants[pickedRestaurantIndex].tables[
					payload.tableIndex
				].tPicked;
		},
		extraPicked: (state, { payload }) => {
			const pickedRestaurantIndex = state.availableRestaurants.findIndex(
				(restaurant) => restaurant.key === payload.key
			);

			// state.availableRestaurants[pickedRestaurantIndex].extras.map(
			// 	(extra) => (extra.xPicked = false)
			// );

			state.availableRestaurants[pickedRestaurantIndex].extras[
				payload.extraIndex
			].xPicked =
				!state.availableRestaurants[pickedRestaurantIndex].extras[
					payload.extraIndex
				].xPicked;
		},
	},
	extraReducers: {
		[getUser.fulfilled]: (state, { payload }) => {
			state.currentUser = payload;
		},
	},
});

export const {
	addTable,
	addExtra,
	removeExtra,
	pickDate,
	clearDate,
	logoutUser,
	tablePicked,
	extraPicked,
} = userSlice.actions;

export default userSlice.reducer;
