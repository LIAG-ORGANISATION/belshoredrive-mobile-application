import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import type React from "react";
import { View } from "react-native";

export const BottomSheetContent: React.FC<{
	children: React.ReactNode;
	scrollable?: boolean;
}> = ({ children, scrollable = true }) => {
	const ContentWrapper = scrollable ? BottomSheetScrollView : BottomSheetView;

	return (
		<BottomSheetView className="flex-1">
			<ContentWrapper className="bg-[#1f1f1f] w-full">
				<View className="w-full flex-col gap-4 p-4">{children}</View>
			</ContentWrapper>
		</BottomSheetView>
	);
};
