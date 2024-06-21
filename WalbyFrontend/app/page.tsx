
// import Header from "@/components/Header";
// import Hero from "@/components/Hero";
// import FeaturedProducts from "@/components/FeaturedProducts";
// import Categories from "@/components/Categories";
// import Testimonials from "@/components/Testimonials";
// import Newsletter from "@/components/Newsletter";
// import Footer from "@/components/Footer";
// import AiAssistant from "@/components/AiAssistant";

// pages/index.js
"use client";
import { IsPlayingProvider } from "./context/IsPlayingContext";
import { useState } from "react";
import Link from 'next/link';
import { TextToSpeech } from "@/components/TextToSpeech";
import AiAssistant from "@/components/AiAssistant";

export default function Home() {

	return (
		<IsPlayingProvider>
			<div className="min-h-screen bg-gray-50">
				<Header />
				<Hero />
				<FeaturedProducts />
				<Categories />
				<Testimonials />
				<Newsletter />
				<Footer />
				<AiAssistant />
			</div>
		</IsPlayingProvider>
	);
}

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<Link href="/" className="text-2xl font-bold text-yellow-400">
					WalBy Store
				</Link>
				<nav className="hidden md:flex space-x-8">
					<Link href="/" className="hover:text-yellow-400">Home</Link>
					<Link href="/products" className="hover:text-yellow-400">Shop</Link>
					<Link href="/services" className="hover:text-yellow-400">Services</Link>
					<Link href="/contact" className="hover:text-yellow-400">Contact</Link>
				</nav>
				<div className="flex items-center space-x-4">
					<Link href="/cart" className="text-yellow-400">
						Welcome Raj :)
					</Link>
					<button
						className="md:hidden hover:text-yellow-400"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>

					</button>
				</div>
			</div>
			{isMenuOpen && (
				<div className="md:hidden bg-blue-600 py-2">
					<Link href="/" className="block px-4 py-2 hover:bg-blue-500">Home</Link>
					<Link href="/products" className="block px-4 py-2 hover:bg-blue-500">Shop</Link>
					<Link href="/services" className="block px-4 py-2 hover:bg-blue-500">Services</Link>
					<Link href="/contact" className="block px-4 py-2 hover:bg-blue-500">Contact</Link>
				</div>
			)}
		</header>
	);
};

const Hero = () => {
	return (
		<div className="bg-yellow-100 py-20">
			<div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
				<div className="md:w-1/2 mb-8 md:mb-0">
					<h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
						Save Money. Live Better.
					</h1>
					<p className="text-xl text-gray-600 mb-6">
						Discover amazing deals on everything you need, all in one place.
					</p>
					<button className="bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-800 transition duration-300">
						Start Shopping
					</button>
				</div>
				<div className="md:w-1/4">
					<img
						src="/walmart.png"
						alt="WalBy Store"
						className="rounded-lg shadow-xl"
					/>
				</div>
			</div>
		</div>
	);
};

const FeaturedProducts = () => {
	const products = [
		{ id: 1, name: 'Smart TV', price: 299.99, image: '/tv.png' },
		{ id: 2, name: 'Lawn Mower', price: 189.99, image: '/mower.png' },
		{ id: 3, name: 'Blender Set', price: 49.99, image: '/blender.png' },
		{ id: 4, name: 'Camping Tent', price: 79.99, image: '/tent.png' },
	];

	return (
		<section className="py-16">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Featured Products</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{products.map((product) => (
						<div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
							<img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
							<div className="p-4">
								<h3 className="text-lg font-semibold mb-2">{product.name}</h3>
								<p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
								<button className="w-full bg-yellow-400 text-blue-700 px-4 py-2 rounded-md hover:bg-yellow-500 transition duration-300">
									Add to Cart
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

const Categories = () => {
	const categories = [
		{ name: 'Electronics', image: '/walmart.png' },
		{ name: 'Groceries', image: '/walmart.png' },
		{ name: 'Home & Garden', image: '/walmart.png' },
		{ name: 'Toys', image: '/walmart.png' },
	];

	return (
		<section className="bg-gray-100 py-16">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Shop by Department</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{categories.map((category) => (
						<div key={category.name} className="relative overflow-hidden rounded-lg shadow-md">
							<img src={category.image} alt={category.name} className="w-full h-34 object-cover" />
							<div className="absolute inset-0 bg-blue-700 bg-opacity-40 flex items-center justify-center">
								<h3 className="text-white text-2xl font-semibold">{category.name}</h3>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

const Testimonials = () => {
	const testimonials = [
		{ id: 1, name: 'Sarah M.', content: 'WalBy always has the best prices on groceries. I save so much every week!' },
		{ id: 2, name: 'John D.', content: 'The variety of products is amazing. I can find everything I need in one trip.' },
		{ id: 3, name: 'Emily L.', content: 'Their online ordering and pickup service is so convenient. It saves me so much time!' },
	];

	return (
		<section className="py-16">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-8 text-blue-700">What Our Customers Say</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((testimonial) => (
						<div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
							<p className="text-gray-600 mb-4">{testimonial.content}</p>
							<p className="font-semibold text-blue-700">{testimonial.name}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

const Newsletter = () => {
	return (
		<section className="bg-blue-700 py-16">
			<div className="container mx-auto px-4 text-center">
				<h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
				<p className="text-yellow-100 mb-8">Get the latest updates on new products and special promotions.</p>
				<form className="max-w-md mx-auto">
					<div className="flex">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
						/>
						<button
							type="submit"
							className="bg-yellow-400 text-blue-700 px-6 py-2 rounded-r-md hover:bg-yellow-500 transition duration-300"
						>
							Subscribe
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};

const Footer = () => {
	return (
		<footer className="bg-blue-800 text-white py-8">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4">About Us</h3>
						<p className="text-gray-300">WalBy Store is your one-stop shop for all your everyday needs at unbeatable prices.</p>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li><Link href="/products" className="text-gray-300 hover:text-yellow-400">Shop</Link></li>
							<li><Link href="/services" className="text-gray-300 hover:text-yellow-400">Services</Link></li>
							<li><Link href="/contact" className="text-gray-300 hover:text-yellow-400">Contact</Link></li>
							<li><Link href="/careers" className="text-gray-300 hover:text-yellow-400">Careers</Link></li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">Follow Us</h3>
						<div className="flex space-x-4">
							<a href="#" className="text-gray-300 hover:text-yellow-400">Facebook</a>
							<a href="#" className="text-gray-300 hover:text-yellow-400">Instagram</a>
							<a href="#" className="text-gray-300 hover:text-yellow-400">Twitter</a>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">Contact</h3>
						<p className="text-gray-300">123 Retail Road</p>
						<p className="text-gray-300">Bentonville, AR 72712</p>
						<p className="text-gray-300">Email: info@walbystore.com</p>
						<p className="text-gray-300">Phone: (123) 456-7890</p>
					</div>
				</div>
				<div className="border-t border-blue-700 mt-8 pt-8 text-center">
					<p className="text-gray-300">&copy; 2024 WalBy Store. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};
