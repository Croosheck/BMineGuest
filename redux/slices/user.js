import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoc, doc, getDocs, collection, query } from "firebase/firestore";
import { auth, db } from "../../firebase";

export const getUser = createAsyncThunk("user/getUser", async () => {
	const docRef = doc(db, "users", auth.currentUser.uid);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const { email, name, totalReservations } = docSnap.data();

		return { email, name, totalReservations };
	}
});

export const getRestaurants = createAsyncThunk(
	"user/getRestaurants",
	async () => {
		const q = query(collection(db, "restaurants"));
		const querySnapshot = await getDocs(q);

		const availableRestaurants = [];

		querySnapshot.forEach((doc) => {
			availableRestaurants.push(doc.data());
		});

		return availableRestaurants;
	}
);

const name = "user";
const initialState = createInitialState();
const reducers = createReducers();
const extraReducers = createExtraReducers(getUser, getRestaurants);

export const userSlice = createSlice({
	name,
	initialState,
	reducers,
	extraReducers,
});

function createInitialState() {
	return {
		currentUser: "",
		reservationData: {
			extras: [],
			table: {},
		},
		reservationDate: "",
		reservationDateParameters: {
			year: Number(),
			month: Number(),
			day: Number(),
			hours: Number(),
			minutes: Number(),
			weekdayNumber: Number(),
		},
		availableRestaurants: [],
		reservationsList: [],
	};
}

function createReducers() {
	return {
		realTimeRestaurants: (state, { payload }) => {
			state.availableRestaurants = [...payload];
		},
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
		clearReservationData: (state, { payload }) => {
			state.reservationData = {
				extras: [],
				table: {},
			};

			const currentRestaurantIndex = state.availableRestaurants.findIndex(
				(restaurant) => restaurant.key === payload
			);

			state.availableRestaurants[currentRestaurantIndex].tables.map(
				(table) => (table.tPicked = false)
			);

			state.availableRestaurants[currentRestaurantIndex].extras.map(
				(extra) => (extra.xPicked = false)
			);
		},
		pickDate: (state, { payload }) => {
			state.reservationDate = payload;
		},
		pickDateParameters: (state, { payload }) => {
			state.reservationDateParameters = payload;
		},
		clearDate: (state) => {
			state.reservationDate = "";
			state.reservationDateParameters = "";
		},
		logoutUser: (state) => {
			state.currentUser = "";
		},
		addFetchedReservations: (state, { payload }) => {
			state.reservationsList = payload;
		},
	};
}

// function createExtraReducers(userThunk, restaurantsThunk) {
// 	return (builder) => {
// 		const { fulfilledUser, pendingUser } = userThunk;
// 		const { fulfilledRestaurants, pendingRestaurants } = restaurantsThunk;

// 		builder.addCase(fulfilledUser, (state, { payload }) => {
// 			state.currentUser = payload;
// 		});
// 		builder.addCase(pendingUser, (state) => {
// 			state.currentUser = null;
// 		});

// 		builder.addCase(fulfilledRestaurants, (state, { payload }) => {
// 			state.availableRestaurants = [...payload];
// 		});
// 		builder.addCase(pendingRestaurants, (state) => {
// 			state.availableRestaurants = [];
// 		});
// 	};
// }
function createExtraReducers() {
	return {
		[getUser.fulfilled]: (state, { payload }) => {
			state.currentUser = payload;
		},
		[getRestaurants.fulfilled]: (state, { payload }) => {
			state.availableRestaurants = [...payload];
		},
	};
}

export const {
	realTimeRestaurants,
	addTable,
	addExtra,
	removeExtra,
	clearReservationData,
	pickDate,
	pickDateParameters,
	clearDate,
	logoutUser,
	addFetchedReservations,
} = userSlice.actions;

export default userSlice.reducer;
