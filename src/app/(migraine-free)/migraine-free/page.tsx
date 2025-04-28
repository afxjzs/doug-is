"use client"

import { supabase } from "@/lib/supabase/publicClient"
import { useEffect, useState, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { TRIGGER_COLORS, type TriggerValue } from "@/lib/constants/colors"
import { CheckIcon } from "@heroicons/react/24/outline"

interface MigraineTrigger {
	id: number
	food: string
	trigger: string
	reason: string | null
	categories: string[] | null
	chemical_triggers: string[] | null
	source: string | null
	notes: string | null
	created_at: string
	updated_at: string
}

interface TriggerFilter {
	value: TriggerValue
	enabled: boolean
}

export default function MigrainePage() {
	const [triggers, setTriggers] = useState<MigraineTrigger[]>([])
	const [filteredTriggers, setFilteredTriggers] = useState<MigraineTrigger[]>(
		[]
	)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [filters, setFilters] = useState({
		food: "",
		reason: "",
		categories: "",
		chemical_triggers: "",
	})
	const [triggerFilters, setTriggerFilters] = useState<TriggerFilter[]>([
		{ value: "Avoid", enabled: true },
		{ value: "OK", enabled: true },
		{ value: "Caution", enabled: true },
		{ value: "Conflicted", enabled: true },
	])

	const toggleTriggerFilter = (value: TriggerValue) => {
		setTriggerFilters(
			triggerFilters.map((filter) =>
				filter.value === value
					? { ...filter, enabled: !filter.enabled }
					: filter
			)
		)
	}

	useEffect(() => {
		async function fetchTriggers() {
			try {
				const { data, error } = await supabase
					.from("migraine_triggers")
					.select("*")
					.order("food", { ascending: true })

				if (error) {
					setError("Failed to load trigger data")
					console.error("Error fetching triggers:", error)
					return
				}

				setTriggers(data || [])
				setFilteredTriggers(data || [])
			} catch (err) {
				setError("An unexpected error occurred")
				console.error("Error:", err)
			} finally {
				setLoading(false)
			}
		}

		fetchTriggers()
	}, [])

	useEffect(() => {
		const filtered = triggers.filter((trigger) => {
			// First check if the trigger type is enabled
			const normalizedTrigger = trigger.trigger
				.toLowerCase()
				.replace("yes", "avoid")
				.replace("no", "ok")
				.replace("ing", "ed")
			const triggerEnabled =
				triggerFilters.find((f) => f.value.toLowerCase() === normalizedTrigger)
					?.enabled ?? true

			if (!triggerEnabled) return false

			const foodMatch = trigger.food
				.toLowerCase()
				.includes(filters.food.toLowerCase())
			const reasonMatch =
				trigger.reason?.toLowerCase().includes(filters.reason.toLowerCase()) ??
				false
			const categoriesMatch =
				trigger.categories?.some((cat) =>
					cat.toLowerCase().includes(filters.categories.toLowerCase())
				) ?? false
			const chemicalMatch =
				trigger.chemical_triggers?.some((chem) =>
					chem.toLowerCase().includes(filters.chemical_triggers.toLowerCase())
				) ?? false

			return (
				foodMatch &&
				(filters.reason === "" || reasonMatch) &&
				(filters.categories === "" || categoriesMatch) &&
				(filters.chemical_triggers === "" || chemicalMatch)
			)
		})
		setFilteredTriggers(filtered)
	}, [filters, triggers, triggerFilters])

	const getTriggerStyle = (value: TriggerValue, enabled: boolean) => {
		switch (value) {
			case "Avoid":
				return enabled
					? "border-red-500/30 text-red-400"
					: "border-gray-700 text-gray-500"
			case "OK":
				return enabled
					? "border-green-500/30 text-green-400"
					: "border-gray-700 text-gray-500"
			case "Caution":
				return enabled
					? "border-yellow-500/30 text-yellow-400"
					: "border-gray-700 text-gray-500"
			case "Conflicted":
				return enabled
					? "border-violet-500/30 text-violet-400"
					: "border-gray-700 text-gray-500"
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<div className="text-xl text-gray-300">Loading...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<div className="text-xl text-red-400">{error}</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col">
			<div className="flex-grow space-y-8">
				<div className="flex flex-col items-center justify-center text-center space-y-4">
					<h1 className="text-4xl font-bold text-gray-100">
						Migraine Trigger Foods Database
					</h1>
					<p className="text-lg text-gray-300 max-w-2xl">
						A comprehensive database of foods and ingredients that may trigger
						migraines, along with their chemical triggers and categories.
					</p>
				</div>

				{/* Trigger Type Toggles */}
				<div className="flex flex-wrap justify-center gap-4">
					{triggerFilters.map((filter) => (
						<button
							key={filter.value}
							onClick={() => toggleTriggerFilter(filter.value)}
							className={`px-6 py-2 rounded-full text-base border transition-all flex items-center gap-2
								${getTriggerStyle(filter.value, filter.enabled)}
								hover:bg-gray-800/50`}
						>
							{filter.enabled && <CheckIcon className="h-4 w-4" />}
							{filter.value}
						</button>
					))}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">
							Filter by Food
						</label>
						<Input
							type="text"
							placeholder="Search foods..."
							value={filters.food}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setFilters((prev) => ({ ...prev, food: e.target.value }))
							}
							className="w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">
							Filter by Reason
						</label>
						<Input
							type="text"
							placeholder="Search reasons..."
							value={filters.reason}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setFilters((prev) => ({ ...prev, reason: e.target.value }))
							}
							className="w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">
							Filter by Categories
						</label>
						<Input
							type="text"
							placeholder="Search categories..."
							value={filters.categories}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setFilters((prev) => ({ ...prev, categories: e.target.value }))
							}
							className="w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">
							Filter by Chemical Triggers
						</label>
						<Input
							type="text"
							placeholder="Search chemical triggers..."
							value={filters.chemical_triggers}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setFilters((prev) => ({
									...prev,
									chemical_triggers: e.target.value,
								}))
							}
							className="w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
						/>
					</div>
				</div>

				<div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full divide-y divide-gray-700">
							<thead>
								<tr className="bg-gray-800">
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
									>
										Food
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
									>
										Trigger
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
									>
										Reason
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
									>
										Categories
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
									>
										Chemical Triggers
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
									>
										Source
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{filteredTriggers.map((trigger) => (
									<tr
										key={trigger.id}
										className={`transition-colors hover:bg-gray-800/20 ${
											triggerFilters.find(
												(f) =>
													f.value.toLowerCase() ===
													trigger.trigger
														.toLowerCase()
														.replace("yes", "avoid")
														.replace("no", "ok")
														.replace("ing", "ed")
											)?.enabled
												? trigger.trigger
														.toLowerCase()
														.replace("yes", "avoid")
														.replace("no", "ok")
														.replace("ing", "ed") === "avoid"
													? "bg-red-900/20"
													: trigger.trigger
															.toLowerCase()
															.replace("yes", "avoid")
															.replace("no", "ok")
															.replace("ing", "ed") === "ok"
													? "bg-green-900/20"
													: trigger.trigger
															.toLowerCase()
															.replace("yes", "avoid")
															.replace("no", "ok")
															.replace("ing", "ed") === "caution"
													? "bg-yellow-900/20"
													: "bg-violet-900/20"
												: ""
										}`}
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-100">
												{trigger.food}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-300">
												{trigger.trigger}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-300">
												{trigger.reason}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-wrap gap-2">
												{trigger.categories?.map((category, idx) => (
													<span
														key={idx}
														className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200"
													>
														{category}
													</span>
												))}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-wrap gap-2">
												{trigger.chemical_triggers?.map((chemical, idx) => (
													<span
														key={idx}
														className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200"
													>
														{chemical}
													</span>
												))}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-300">
												{trigger.source}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<footer className="mt-16 border-t border-gray-800 pt-8 pb-4">
				<div className="text-center space-y-4">
					<p className="text-gray-300 italic">
						Built with love by Doug for his wife Whitney, who struggles with
						migraines almost daily. 💜
					</p>
					<Link
						href="/"
						className="inline-block text-purple-400 hover:text-purple-300 transition-colors"
					>
						← Back to doug-is
					</Link>
				</div>
			</footer>
		</div>
	)
}
