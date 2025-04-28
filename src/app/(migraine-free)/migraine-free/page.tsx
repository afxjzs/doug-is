"use client"

import { supabase } from "@/lib/supabase/publicClient"
import { useEffect, useState, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

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
	}, [filters, triggers])

	const getTriggerRowColor = (trigger: string) => {
		switch (trigger.toLowerCase()) {
			case "yes":
				return "bg-red-900/20 hover:bg-red-900/30"
			case "no":
				return "bg-green-900/20 hover:bg-green-900/30"
			case "caution":
				return "bg-yellow-900/20 hover:bg-yellow-900/30"
			case "conflict":
				return "bg-blue-900/20 hover:bg-blue-900/30"
			default:
				return "hover:bg-gray-800/20"
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
										className={`transition-colors ${getTriggerRowColor(
											trigger.trigger
										)}`}
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
