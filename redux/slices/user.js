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
		reservationData: {},
		reservationDate: "",
		availableRestaurants: restaurants,
	},
	reducers: {
		addReservationItem: (state, { payload }) => {
			state.reservationData = { ...state.reservationData, ...payload };
		},
		removeReservationItem: (state, { payload }) => {
			state.reservationData = { ...state.reservationData, ...payload };
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
	},
	extraReducers: {
		[getUser.fulfilled]: (state, { payload }) => {
			state.currentUser = payload;
		},
	},
});

export const {
	addReservationItem,
	removeReservationItem,
	pickDate,
	clearDate,
	logoutUser,
	tablePicked,
} = userSlice.actions;

export default userSlice.reducer;
