import { SkeletonGrid } from "@/components/ui/skeleton-grid";
import { Input } from "@/components/ui/text-input";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { supabase } from "@/lib/supabase";
import { useFetchBrands } from "@/network/brands";
import { useFetchDepartments } from "@/network/departments";
import { useFetchTypes, useVehicles } from "@/network/vehicles";
import type { Tables } from "@/types/supabase";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
	Image,
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

type Filters = {
	brands: string[];
	departments: string[];
	types: string[];
};

export default function SearchScreen() {
	const [filters, setFilters] = useState<Filters>({
		brands: [],
		departments: [],
		types: [],
	});

	const { data: vehiclesPages, isLoading: isVehiclesLoading } = useVehicles();
	const { data: brands = [], isLoading: isLoadingBrands } = useFetchBrands();
	const { data: departments = [], isLoading: isLoadingDepartments } =
		useFetchDepartments();
	const { data: types = [], isLoading: isLoadingTypes } = useFetchTypes();
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchActive, setIsSearchActive] = useState(false);

	const { data: searchResults, isLoading: isLoadingSearchResults } = useQuery({
		queryKey: ["userSearch", searchQuery],
		queryFn: async () => {
			if (!searchQuery.trim()) return [];

			const { data, error } = await supabase
				.from("user_profiles")
				.select("user_id, pseudo, profile_picture_url")
				.ilike("pseudo", `%${searchQuery}%`)
				.limit(20);

			if (error) throw error;
			return data;
		},
		enabled: searchQuery.length > 0,
	});

	const vehicles = (vehiclesPages?.pages.flat() ?? []).filter((vehicle) => {
		const matchesBrand =
			filters.brands.length === 0 ||
			(vehicle.brand_id && filters.brands.includes(vehicle.brand_id));
		const matchesDepartment =
			filters.departments.length === 0 ||
			(vehicle.department_id &&
				filters.departments.includes(vehicle.department_id));
		const matchesType =
			filters.types.length === 0 ||
			(vehicle.type_id && filters.types.includes(vehicle.type_id));

		return matchesBrand && matchesDepartment && matchesType;
	});

	const renderVehicle = ({ item }: { item: Tables<"vehicles"> }) => (
		<TouchableOpacity
			className="w-full aspect-square p-0.5"
			onPress={() => {
				// Navigate to vehicle detail
			}}
		>
			<View className="w-full h-full overflow-hidden bg-gray-800">
				{item.media?.[0] ? (
					<Image
						source={{
							uri: formatPicturesUri("vehicles", item.media?.[0]),
						}}
						className="w-full h-full"
						resizeMode="cover"
					/>
				) : (
					<View className="w-full h-full items-center justify-center">
						<Text className="text-gray-400">No Image</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);

	const brandFilterSheetRef = useRef<BottomSheet>(null);
	const departmentFilterSheetRef = useRef<BottomSheet>(null);
	const typeFilterSheetRef = useRef<BottomSheet>(null);

	const openBottomSheet = (sheetRef: React.RefObject<BottomSheet>) => {
		for (const ref of [
			brandFilterSheetRef,
			departmentFilterSheetRef,
			typeFilterSheetRef,
		]) {
			if (ref !== sheetRef && ref.current) {
				ref.current.close();
			}
		}

		sheetRef.current?.expand();
	};

	const toggleFilter = (type: keyof Filters, id: string) => {
		setFilters((prev) => {
			const currentSelection = [...prev[type]];
			if (currentSelection.includes(id)) {
				return {
					...prev,
					[type]: currentSelection.filter((item) => item !== id),
				};
			}
			return {
				...prev,
				[type]: [...currentSelection, id],
			};
		});
	};

	const clearFilter = (type: keyof Filters) => {
		setFilters((prev) => ({
			...prev,
			[type]: [],
		}));
	};

	return (
		<View className="flex-1 bg-black py-safe-offset-2 relative">
			<Input
				name="search"
				placeholder="Rechercher un utilisateur..."
				value={searchQuery}
				onChangeText={setSearchQuery}
				placeholderTextColor="#757575"
				onFocus={() => setIsSearchActive(true)}
				classes="w-full"
			/>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="py-3 px-2 max-h-14"
			>
				<TouchableOpacity
					className={
						"w-fit h-10 border flex flex-row gap-1 items-center justify-between border-white/20  bg-white/15 rounded-lg px-4 mr-2"
					}
					onPress={() => openBottomSheet(brandFilterSheetRef)}
				>
					<Text className="text-white">
						{filters.brands.length
							? `Marques (${filters.brands.length})`
							: "Marques"}
					</Text>
					<Ionicons name="chevron-down" color="white" />
				</TouchableOpacity>

				<TouchableOpacity
					className={
						"w-fit h-10 border flex flex-row gap-1 items-center justify-between border-white/20  bg-white/15 rounded-lg px-4 mr-2"
					}
					onPress={() => openBottomSheet(departmentFilterSheetRef)}
				>
					<Text className="text-white">
						{filters.departments.length
							? `Départements (${filters.departments.length})`
							: "Départements"}
					</Text>
					<Ionicons name="chevron-down" color="white" />
				</TouchableOpacity>

				<TouchableOpacity
					className={
						"w-fit h-10 border flex flex-row gap-1 items-center justify-between border-white/20  bg-white/15 rounded-lg px-4 mr-2"
					}
					onPress={() => openBottomSheet(typeFilterSheetRef)}
				>
					<Text className="text-white">
						{filters.types.length ? `Types (${filters.types.length})` : "Types"}
					</Text>
					<Ionicons name="chevron-down" color="white" />
				</TouchableOpacity>

				{(filters.brands.length > 0 ||
					filters.departments.length > 0 ||
					filters.types.length > 0) && (
					<TouchableOpacity
						className="w-fit h-10 border flex flex-row gap-1 items-center justify-between rounded-lg px-4 mr-2 bg-red-400"
						onPress={() =>
							setFilters({ brands: [], departments: [], types: [] })
						}
					>
						<Text className="text-white">Effacer tout</Text>
					</TouchableOpacity>
				)}
			</ScrollView>

			{isSearchActive && (
				<View className="absolute left-0 right-0 top-[110px] bottom-0 bg-black z-50">
					<FlashList
						data={searchResults}
						estimatedItemSize={70}
						renderItem={({ item }) => (
							<TouchableOpacity
								className="flex-row items-center gap-3 py-3 px-4 border-b border-gray-800"
								onPress={() => {
									setIsSearchActive(false);
									router.push({
										pathname: "/(tabs)/user",
										params: {
											userId: item.user_id,
											previousScreen: "/(tabs)/discover",
										},
									});
								}}
							>
								<Image
									source={{
										uri: formatPicturesUri(
											"profile_pictures",
											item.profile_picture_url,
										),
									}}
									className="w-12 h-12 rounded-full bg-gray-700"
								/>
								<Text className="text-white text-lg">{item.pseudo}</Text>
							</TouchableOpacity>
						)}
						ListEmptyComponent={() => (
							<View className="flex-1 items-center justify-center py-8">
								<Text className="text-gray-500">
									{searchQuery.length > 0
										? "Aucun utilisateur trouvé"
										: "Commencez à taper pour rechercher"}
								</Text>
							</View>
						)}
					/>
				</View>
			)}

			{isVehiclesLoading ||
			isLoadingBrands ||
			isLoadingDepartments ||
			isLoadingTypes ? (
				<View className="flex-1 bg-black mt-4">
					<SkeletonGrid items={12} />
				</View>
			) : (
				<FlashList
					data={vehicles}
					renderItem={renderVehicle}
					numColumns={3}
					estimatedItemSize={150}
					className="flex-1 mt-4"
					contentContainerStyle={{ paddingBottom: 20 }}
				/>
			)}
			<BottomSheet
				ref={brandFilterSheetRef}
				snapPoints={[200, "70%"]}
				enablePanDownToClose
				index={-1}
				backgroundStyle={{ backgroundColor: "#1c1c1e" }}
				handleIndicatorStyle={{ backgroundColor: "#777" }}
			>
				<BottomSheetView className="flex-1 p-4">
					<View className="flex-row justify-between items-center mb-4">
						<Text className="text-white text-xl font-semibold">Marques</Text>
						<TouchableOpacity onPress={() => clearFilter("brands")}>
							<Text className="text-primary">Effacer</Text>
						</TouchableOpacity>
					</View>
					<ScrollView className="flex-1">
						{brands.map((brand) => (
							<Pressable
								key={brand.brand_id}
								className="flex-row items-center py-3"
								onPress={() => toggleFilter("brands", brand.brand_id)}
							>
								<View
									className={`w-6 h-6 border rounded mr-3 items-center justify-center ${filters.brands.includes(brand.brand_id) ? "border-primary bg-primary" : "border-gray-500"}`}
								>
									{filters.brands.includes(brand.brand_id) && (
										<Ionicons name="checkmark" size={16} color="white" />
									)}
								</View>
								<Text className="text-white">{brand.name}</Text>
							</Pressable>
						))}
					</ScrollView>
				</BottomSheetView>
			</BottomSheet>

			<BottomSheet
				ref={departmentFilterSheetRef}
				snapPoints={[200, "70%"]}
				enablePanDownToClose
				index={-1}
				backgroundStyle={{ backgroundColor: "#1c1c1e" }}
				handleIndicatorStyle={{ backgroundColor: "#777" }}
			>
				<BottomSheetView className="flex-1 p-4">
					<View className="flex-row justify-between items-center mb-4">
						<Text className="text-white text-xl font-semibold">
							Départements
						</Text>
						<TouchableOpacity onPress={() => clearFilter("departments")}>
							<Text className="text-primary">Effacer</Text>
						</TouchableOpacity>
					</View>
					<ScrollView className="flex-1">
						{departments.map((department) => (
							<Pressable
								key={department.department_id}
								className="flex-row items-center py-3 "
								onPress={() =>
									toggleFilter("departments", department.department_id)
								}
							>
								<View
									className={`w-6 h-6 border rounded mr-3 items-center justify-center ${filters.departments.includes(department.department_id) ? "border-primary bg-primary" : "border-gray-500"}`}
								>
									{filters.departments.includes(department.department_id) && (
										<Ionicons name="checkmark" size={16} color="white" />
									)}
								</View>
								<Text className="text-white">{department.name}</Text>
							</Pressable>
						))}
					</ScrollView>
				</BottomSheetView>
			</BottomSheet>

			<BottomSheet
				ref={typeFilterSheetRef}
				snapPoints={[200, "70%"]}
				enablePanDownToClose
				index={-1}
				backgroundStyle={{ backgroundColor: "#1c1c1e" }}
				handleIndicatorStyle={{ backgroundColor: "#777" }}
				style={{
					width: "100%",
				}}
			>
				<BottomSheetView className="flex-1 p-4">
					<View className="flex-row justify-between items-center mb-4">
						<Text className="text-white text-xl font-semibold">Types</Text>
						<TouchableOpacity onPress={() => clearFilter("types")}>
							<Text className="text-primary">Effacer</Text>
						</TouchableOpacity>
					</View>
					<ScrollView className="flex-1">
						{types?.map((type) => (
							<Pressable
								key={type.id}
								className="flex-row items-center py-3"
								onPress={() => toggleFilter("types", type.id)}
							>
								<View
									className={`w-6 h-6 border rounded mr-3 items-center justify-center ${filters.types.includes(type.id) ? "border-primary bg-primary" : "border-gray-500"}`}
								>
									{filters.types.includes(type.id) && (
										<Ionicons name="checkmark" size={16} color="white" />
									)}
								</View>
								<Text className="text-white">{type.label}</Text>
							</Pressable>
						))}
					</ScrollView>
				</BottomSheetView>
			</BottomSheet>
		</View>
	);
}
