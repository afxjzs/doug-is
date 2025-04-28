"use client"

import { supabase } from "@/lib/supabase/publicClient"
import { useEffect, useState, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { TRIGGER_COLORS, type TriggerValue } from "@/lib/constants/colors"
import { CheckIcon } from "@heroicons/react/24/outline"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

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
	const [searchQuery, setSearchQuery] = useState("")
	const [triggerFilters, setTriggerFilters] = useState<TriggerFilter[]>(() => {
		// Try to get saved filters from localStorage
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("triggerFilters")
			if (saved) {
				try {
					return JSON.parse(saved)
				} catch (e) {
					console.error("Error parsing saved filters:", e)
				}
			}
		}
		// Default filters if nothing in localStorage
		return [
			{ value: "Avoid", enabled: true },
			{ value: "OK", enabled: true },
			{ value: "Caution", enabled: true },
			{ value: "Conflicted", enabled: true },
		]
	})

	const toggleTriggerFilter = (value: TriggerValue) => {
		const newFilters = triggerFilters.map((filter) =>
			filter.value === value ? { ...filter, enabled: !filter.enabled } : filter
		)
		setTriggerFilters(newFilters)
		// Save to localStorage
		if (typeof window !== "undefined") {
			localStorage.setItem("triggerFilters", JSON.stringify(newFilters))
		}
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

				// Debug: Check if we have any notes
				console.log("Triggers with notes:", data?.filter((t) => t.notes).length)
				console.log("Sample note:", data?.find((t) => t.notes)?.notes)

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

			// Search across all fields
			const query = searchQuery.toLowerCase()
			if (query === "") return true

			const foodMatch = trigger.food.toLowerCase().includes(query)
			const reasonMatch = trigger.reason?.toLowerCase().includes(query) ?? false
			const categoriesMatch =
				trigger.categories?.some((cat) => cat.toLowerCase().includes(query)) ??
				false
			const chemicalMatch =
				trigger.chemical_triggers?.some((chem) =>
					chem.toLowerCase().includes(query)
				) ?? false

			return foodMatch || reasonMatch || categoriesMatch || chemicalMatch
		})
		setFilteredTriggers(filtered)
	}, [searchQuery, triggers, triggerFilters])

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

	const normalizeTriggerDisplay = (trigger: string): string => {
		return trigger
			.toLowerCase()
			.replace("yes", "avoid")
			.replace("no", "ok")
			.replace("ing", "ed")
			.replace(/^[a-z]/, (c) => c.toUpperCase()) // Capitalize first letter
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
		<TooltipProvider>
			<div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col">
				<div className="flex-grow space-y-8">
					<div className="flex flex-col items-center justify-center text-center space-y-4">
						<h1 className="text-4xl font-bold text-gray-100">
							Migraine Trigger Foods Database (MTFDB)
						</h1>
						<p className="text-lg text-gray-300 max-w-2xl">
							A comprehensive database of foods and ingredients that may trigger
							migraines, along with their chemical triggers and categories.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
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
						<div className="w-full sm:w-auto sm:min-w-[300px]">
							<Input
								type="text"
								placeholder="Search foods, reasons, categories, or chemical triggers..."
								value={searchQuery}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setSearchQuery(e.target.value)
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
													{normalizeTriggerDisplay(trigger.trigger)}
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
													{trigger.source && (
														<>
															{trigger.notes ? (
																<Tooltip>
																	<TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-2">
																		{trigger.source}
																	</TooltipTrigger>
																	<TooltipContent side="left">
																		<p className="max-w-[200px] whitespace-normal">
																			{trigger.notes}
																		</p>
																	</TooltipContent>
																</Tooltip>
															) : (
																<span>{trigger.source}</span>
															)}
														</>
													)}
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
		</TooltipProvider>
	)
}
