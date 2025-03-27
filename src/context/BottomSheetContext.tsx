import BottomSheet from "@gorhom/bottom-sheet";
import React, {
	createContext,
	useContext,
	useReducer,
	type ReactNode,
} from "react";

// Types
export type BottomSheetConfig = {
	id: string;
	component: ReactNode;
	snapPoints: (string | number)[];
	enablePanDownToClose?: boolean;
	backgroundStyle?: object;
	handleIndicatorStyle?: object;
	onChange?: (index: number) => void;
};

type BottomSheetState = {
	sheets: Record<
		string,
		BottomSheetConfig & {
			isVisible: boolean;
			ref: React.RefObject<BottomSheet>;
		}
	>;
};

type BottomSheetAction =
	| {
			type: "REGISTER_SHEET";
			payload: { id: string; config: BottomSheetConfig };
	  }
	| { type: "SHOW_SHEET"; payload: { id: string } }
	| { type: "HIDE_SHEET"; payload: { id: string } }
	| {
			type: "UPDATE_SHEET";
			payload: { id: string; config: Partial<BottomSheetConfig> };
	  };

// Initial state
const initialState: BottomSheetState = {
	sheets: {},
};

// Reducer
const bottomSheetReducer = (
	state: BottomSheetState,
	action: BottomSheetAction,
): BottomSheetState => {
	switch (action.type) {
		case "REGISTER_SHEET":
			return {
				...state,
				sheets: {
					...state.sheets,
					[action.payload.id]: {
						...action.payload.config,
						isVisible: false,
						ref: React.createRef<BottomSheet>(),
					},
				},
			};
		case "SHOW_SHEET":
			return {
				...state,
				sheets: {
					...state.sheets,
					[action.payload.id]: {
						...state.sheets[action.payload.id],
						isVisible: true,
					},
				},
			};
		case "HIDE_SHEET":
			return {
				...state,
				sheets: {
					...state.sheets,
					[action.payload.id]: {
						...state.sheets[action.payload.id],
						isVisible: false,
					},
				},
			};
		case "UPDATE_SHEET":
			return {
				...state,
				sheets: {
					...state.sheets,
					[action.payload.id]: {
						...state.sheets[action.payload.id],
						...action.payload.config,
					},
				},
			};
		default:
			return state;
	}
};

// Context
type BottomSheetContextType = {
	state: BottomSheetState;
	registerSheet: (id: string, config: BottomSheetConfig) => void;
	showSheet: (id: string) => void;
	hideSheet: (id: string) => void;
	updateSheet: (id: string, config: Partial<BottomSheetConfig>) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
	undefined,
);

// Provider
export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(bottomSheetReducer, initialState);

	const registerSheet = (id: string, config: BottomSheetConfig) => {
		dispatch({ type: "REGISTER_SHEET", payload: { id, config } });
	};

	const showSheet = (id: string) => {
		dispatch({ type: "SHOW_SHEET", payload: { id } });
		// Actually show the bottom sheet
		setTimeout(() => {
			const sheet = state.sheets[id];
			if (sheet?.ref.current) {
				sheet.ref.current.expand();
			}
		}, 0);
	};

	const hideSheet = (id: string) => {
		const sheet = state.sheets[id];
		if (sheet?.ref.current) {
			sheet.ref.current.close();
			// We delay the state change to allow animation to finish
			setTimeout(() => {
				dispatch({ type: "HIDE_SHEET", payload: { id } });
			}, 300);
		}
	};

	const updateSheet = (id: string, config: Partial<BottomSheetConfig>) => {
		dispatch({ type: "UPDATE_SHEET", payload: { id, config } });
	};

	const value = {
		state,
		registerSheet,
		showSheet,
		hideSheet,
		updateSheet,
	};

	return (
		<BottomSheetContext.Provider value={value}>
			{children}
			{/* Render all registered bottom sheets */}
			{Object.entries(state.sheets).map(([id, sheet]) => (
				<BottomSheet
					key={id}
					ref={sheet.ref}
					snapPoints={sheet.snapPoints}
					enablePanDownToClose={sheet.enablePanDownToClose ?? true}
					backgroundStyle={
						sheet.backgroundStyle ?? { backgroundColor: "#1f1f1f" }
					}
					handleIndicatorStyle={
						sheet.handleIndicatorStyle ?? { backgroundColor: "#fff" }
					}
					onChange={sheet.onChange ?? (() => {})}
					index={-1}
				>
					{sheet.component}
				</BottomSheet>
			))}
		</BottomSheetContext.Provider>
	);
};

// Custom hook
export const useBottomSheet = () => {
	const context = useContext(BottomSheetContext);
	if (context === undefined) {
		throw new Error("useBottomSheet must be used within a BottomSheetProvider");
	}
	return context;
};
