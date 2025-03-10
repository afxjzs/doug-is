import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Shopping List App | Doug.is",
	description:
		"Download my shopping list app to help organize your shopping experience.",
}

export default function ShoppingPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					Shopping List App
				</h1>
				<p className="text-xl text-gray-600">
					A simple, intuitive app to help you organize your shopping experience.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
				<div className="space-y-6">
					<div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							Currently in TestFlight
						</h2>
						<p className="text-gray-600 mb-6">
							The Shopping List app is currently available through TestFlight
							for iOS users. Join the beta program to get early access and
							provide feedback.
						</p>
						<Link
							href="https://testflight.apple.com/join/your-testflight-code"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
						>
							Join TestFlight Beta
						</Link>
					</div>

					<div className="space-y-4">
						<h3 className="text-xl font-semibold text-gray-900">
							Key Features
						</h3>
						<ul className="space-y-3">
							<li className="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span>
									Create multiple shopping lists for different stores or
									occasions
								</span>
							</li>
							<li className="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span>Organize items by category for efficient shopping</span>
							</li>
							<li className="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span>Share lists with family members or roommates</span>
							</li>
							<li className="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span>Save frequently purchased items for quick addition</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="relative h-[600px] w-full rounded-xl overflow-hidden shadow-lg">
					<Image
						src="/images/shopping-app-mockup.jpg"
						alt="Shopping List App Mockup"
						fill
						className="object-cover"
					/>
				</div>
			</div>

			<div className="mt-16 bg-gray-50 p-8 rounded-lg">
				<h3 className="text-2xl font-semibold text-gray-900 mb-4">
					Coming Soon
				</h3>
				<p className="text-gray-600 mb-6">
					We&apos;re working on exciting new features for the Shopping List app,
					including:
				</p>
				<ul className="space-y-3">
					<li className="flex items-start">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
						<span>Price tracking and budget features</span>
					</li>
					<li className="flex items-start">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
						<span>Integration with popular grocery delivery services</span>
					</li>
					<li className="flex items-start">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
						<span>Android version</span>
					</li>
				</ul>
			</div>
		</div>
	)
}
