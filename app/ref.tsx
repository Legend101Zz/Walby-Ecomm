// pages/index.js
"use client";
import { IsPlayingProvider } from "./context/IsPlayingContext";
import { useState } from "react";
// components/Header.js

import Link from 'next/link';
// import Header from "@/components/Header";
// import Hero from "@/components/Hero";
// import FeaturedProducts from "@/components/FeaturedProducts";
// import Categories from "@/components/Categories";
// import Testimonials from "@/components/Testimonials";
// import Newsletter from "@/components/Newsletter";
// import Footer from "@/components/Footer";
// import AiAssistant from "@/components/AiAssistant";

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
		<header className="bg-white shadow-md sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<Link href="/" className="text-2xl font-bold text-indigo-600">
					FashionFusion
				</Link>
				<nav className="hidden md:flex space-x-8">
					<Link href="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
					<Link href="/products" className="text-gray-600 hover:text-indigo-600">Shop</Link>
					<Link href="/about" className="text-gray-600 hover:text-indigo-600">About</Link>
					<Link href="/contact" className="text-gray-600 hover:text-indigo-600">Contact</Link>
				</nav>
				<div className="flex items-center space-x-4">
					<Link href="/cart" className="text-gray-600 hover:text-indigo-600">
						{/* <ShoppingCartIcon className="h-6 w-6" /> */}
					</Link>
					<button
						className="md:hidden text-gray-600 hover:text-indigo-600"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{/* {isMenuOpen ? (
							// <XIcon className="h-6 w-6" />
						) : (
							<MenuIcon className="h-6 w-6" />
						)} */}
					</button>
				</div>
			</div>
			{isMenuOpen && (
				<div className="md:hidden bg-white py-2">
					<Link href="/" className="block px-4 py-2 text-gray-600 hover:bg-indigo-50">Home</Link>
					<Link href="/products" className="block px-4 py-2 text-gray-600 hover:bg-indigo-50">Shop</Link>
					<Link href="/about" className="block px-4 py-2 text-gray-600 hover:bg-indigo-50">About</Link>
					<Link href="/contact" className="block px-4 py-2 text-gray-600 hover:bg-indigo-50">Contact</Link>
				</div>
			)}
		</header>
	);
};



// components/Hero.js
const Hero = () => {
	return (
		<div className="bg-indigo-100 py-20">
			<div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
				<div className="md:w-1/2 mb-8 md:mb-0">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
						Discover Your Style with FashionFusion
					</h1>
					<p className="text-xl text-gray-600 mb-6">
						Explore our curated collection of trendy and sustainable fashion.
					</p>
					<button className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition duration-300">
						Shop Now
					</button>
				</div>
				<div className="md:w-1/2">
					<img
						src="/hero-image.jpg"
						alt="Fashion model"
						className="rounded-lg shadow-xl"
					/>
				</div>
			</div>
		</div>
	);
};


// components/FeaturedProducts.js
const FeaturedProducts = () => {
	const products = [
		{ id: 1, name: 'Summer Dress', price: 59.99, image: '/product1.jpg' },
		{ id: 2, name: 'Classic Denim Jacket', price: 89.99, image: '/product2.jpg' },
		{ id: 3, name: 'Leather Handbag', price: 129.99, image: '/product3.jpg' },
		{ id: 4, name: 'Sunglasses', price: 39.99, image: '/product4.jpg' },
	];

	return (
		<section className="py-16">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{products.map((product) => (
						<div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
							<img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
							<div className="p-4">
								<h3 className="text-lg font-semibold mb-2">{product.name}</h3>
								<p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
								<button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
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



// components/Categories.js
const Categories = () => {
	const categories = [
		{ name: 'Women', image: '/category-women.jpg' },
		{ name: 'Men', image: '/category-men.jpg' },
		{ name: 'Accessories', image: '/category-accessories.jpg' },
		{ name: 'Shoes', image: '/category-shoes.jpg' },
	];

	return (
		<section className="bg-gray-100 py-16">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{categories.map((category) => (
						<div key={category.name} className="relative overflow-hidden rounded-lg shadow-md">
							<img src={category.image} alt={category.name} className="w-full h-64 object-cover" />
							<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
								<h3 className="text-white text-2xl font-semibold">{category.name}</h3>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};



// components/Testimonials.js
const Testimonials = () => {
	const testimonials = [
		{ id: 1, name: 'Sarah M.', content: 'I love the quality and style of FashionFusion products. They always keep me looking trendy!' },
		{ id: 2, name: 'John D.', content: 'Great customer service and fast shipping. I\'m a loyal customer for life!' },
		{ id: 3, name: 'Emily L.', content: 'The AI assistant helped me find the perfect outfit for my event. Highly recommend!' },
	];

	return (
		<section className="py-16">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((testimonial) => (
						<div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
							{/* <p className="text-gray-600 mb-4">"{testimonial.content}"</p> */}
							<p className="font-semibold">{testimonial.name}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};



// components/Newsletter.js
const Newsletter = () => {
	return (
		<section className="bg-indigo-600 py-16">
			<div className="container mx-auto px-4 text-center">
				<h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
				<p className="text-indigo-100 mb-8">Get the latest updates on new products and special promotions.</p>
				<form className="max-w-md mx-auto">
					<div className="flex">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
						/>
						<button
							type="submit"
							className="bg-indigo-800 text-white px-6 py-2 rounded-r-md hover:bg-indigo-900 transition duration-300"
						>
							Subscribe
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};



// components/Footer.js
const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white py-8">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4">About Us</h3>
						<p className="text-gray-400">FashionFusion is your one-stop shop for trendy and sustainable fashion.</p>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li><Link href="/products" className="text-gray-400 hover:text-white">Shop</Link></li>
							<li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
							<li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
							<li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">Follow Us</h3>
						<div className="flex space-x-4">
							<a href="#" className="text-gray-400 hover:text-white">Facebook</a>
							<a href="#" className="text-gray-400 hover:text-white">Instagram</a>
							<a href="#" className="text-gray-400 hover:text-white">Twitter</a>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">Contact</h3>
						<p className="text-gray-400">123 Fashion Street</p>
						<p className="text-gray-400">New York, NY 10001</p>
						<p className="text-gray-400">Email: info@fashionfusion.com</p>
						<p className="text-gray-400">Phone: (123) 456-7890</p>
					</div>
				</div>
				<div className="border-t border-gray-700 mt-8 pt-8 text-center">
					<p className="text-gray-400">&copy; 2024 FashionFusion. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};




import { ChatBotCanvas } from "@/components/ChatBotCanvas";
import { TextToSpeech } from "@/components/TextToSpeech";

const AiAssistant = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{isOpen ? (
				<div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ width: '350px', height: '500px' }}>
					<div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
						<h3 className="font-semibold">AI Fashion Assistant</h3>
						<button onClick={() => setIsOpen(false)} className="text-white hover:text-indigo-200">
							{/* <XIcon className="h-6 w-6" /> */}
						</button>
					</div>
					<div >
						<ChatBotCanvas />
					</div>
					<div>
						<TextToSpeech />
					</div>
				</div>
			) : (
				<button
					onClick={() => setIsOpen(true)}
					className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
				>
					Chat
				</button>
			)}
		</div>
	);
};

