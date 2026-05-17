/** @format */

import bcrypt from 'bcrypt';

import { supabase } from '../config/supabase.js';

const seedUsers = async () => {
	try {
		const hashedPassword = await bcrypt.hash("password", 10);

		const users = [
			// =========================
			// VENDORS
			// =========================
			{
				username: "vendor_cimol_bojot",
				name: "Cimol Bojot Aa",
				email: "cimolbojot@test.com",
				password: hashedPassword,
				role: "vendor",
				vendor_status: "active",
				description:
					"Pedagang cimol keliling legend di area kampus, terkenal dengan level pedas brutal dan harga murah meriah.",
				vendor_additional_info: {
					type: "snack",
					specialty: "cimol pedas level brutal",
					starting_price: 5000,
					price_range: "low",
					open_hour: "15:00",
					close_hour: "23:30",
					rating: 4.5,
					tags: ["pedas", "street food", "snack", "murah"],
					popularity: 85,
				},
			},
			{
				username: "vendor_seblak_galak",
				name: "Seblak Galak Bandung",
				email: "seblakgalak@test.com",
				password: hashedPassword,
				role: "vendor",
				vendor_status: "active",
				description:
					"Seblak khas Bandung dengan level pedas ekstrem yang sering bikin pelanggan nyesel tapi balik lagi.",
				vendor_additional_info: {
					type: "food",
					specialty: "seblak level neraka",
					starting_price: 10000,
					price_range: "mid",
					open_hour: "11:00",
					close_hour: "22:00",
					rating: 4.8,
					tags: ["pedas ekstrem", "bandung", "comfort food"],
					popularity: 95,
				},
			},
			{
				username: "vendor_ayam_geprek_raja",
				name: "Ayam Geprek Raja Pedas",
				email: "geprekraja@test.com",
				password: hashedPassword,
				role: "vendor",
				vendor_status: "idle",
				description:
					"Ayam geprek dengan sambal super pedas, cocok buat yang mau uji mental dan toleransi cabai.",
				vendor_additional_info: {
					type: "food",
					specialty: "extra pedas unlimited",
					starting_price: 12000,
					price_range: "mid",
					open_hour: "10:00",
					close_hour: "21:00",
					rating: 4.3,
					tags: ["spicy", "fried chicken"],
					popularity: 78,
				},
			},
			{
				username: "vendor_nasgor_abang",
				name: "Nasi Goreng Abang Abang",
				email: "nasgorabang@test.com",
				password: hashedPassword,
				role: "vendor",
				vendor_status: "active",
				description:
					"Nasi goreng kaki lima malam hari dengan aroma khas jalanan dan porsi besar untuk anak kos.",
				vendor_additional_info: {
					type: "food",
					specialty: "nasgor kaki lima legendaris",
					starting_price: 10000,
					price_range: "low",
					open_hour: "16:00",
					close_hour: "02:00",
					rating: 4.2,
					tags: ["fried rice", "night food"],
					popularity: 80,
				},
			},
			{
				username: "vendor_bakso_malang",
				name: "Bakso Malang 88",
				email: "baksomalang@test.com",
				password: hashedPassword,
				role: "vendor",
				vendor_status: "moving",
				description:
					"Bakso Malang dengan kuah gurih dan varian lengkap, sering pindah lokasi mengikuti keramaian.",
				vendor_additional_info: {
					type: "food",
					specialty: "bakso urat kuah kental",
					starting_price: 15000,
					price_range: "mid",
					open_hour: "09:00",
					close_hour: "22:00",
					rating: 4.4,
					tags: ["bakso", "comfort food"],
					popularity: 82,
				},
			},
			{
				username: "vendor_sate_madura",
				name: "Sate Madura Pak Darto",
				email: "satemadura@test.com",
				password: hashedPassword,
				role: "vendor",
				vendor_status: "active",
				description:
					"Sate Madura legit dengan bumbu kacang kental, sering jadi incaran malam hari.",
				vendor_additional_info: {
					type: "food",
					specialty: "sate kambing legit",
					starting_price: 15000,
					price_range: "mid",
					open_hour: "17:00",
					close_hour: "23:00",
					rating: 4.6,
					tags: ["sate", "grill", "street food"],
					popularity: 88,
				},
			},
			{
				username: "vendor_kopi_keliling",
				name: "Kopi Keliling Bang Jago",
				email: "kopikeliling@test.com",
				password: hashedPassword,
				role: "vendor",
				vendor_status: "active",
				description:
					"Kopi keliling malam hari dengan target anak begadang dan pekerja malam.",
				vendor_additional_info: {
					type: "drink",
					specialty: "kopi susu gula aren",
					starting_price: 8000,
					price_range: "low",
					open_hour: "17:00",
					close_hour: "02:00",
					rating: 4.7,
					tags: ["coffee", "night vendor"],
					popularity: 90,
				},
			},
			{
				username: "vendor_mie_ayam",
				name: "Mie Ayam Legend Pakde",
				email: "mieayam@test.com",
				password: hashedPassword,
				role: "vendor",
				vendor_status: "close",
				description:
					"Mie ayam klasik yang dulu ramai, sekarang jarang buka tapi masih punya pelanggan loyal.",
				vendor_additional_info: {
					type: "food",
					specialty: "mie ayam bakso klasik",
					starting_price: 12000,
					price_range: "low",
					open_hour: "10:00",
					close_hour: "21:00",
					rating: 4.1,
					tags: ["noodle", "comfort food"],
					popularity: 70,
				},
			},
			{
				username: "vendor_jasuke",
				name: "Jasuke Corn Street",
				email: "jasuke@test.com",
				password: hashedPassword,
				role: "vendor",
				vendor_status: "active",
				description:
					"Jagung susu keju manis yang sering jadi snack sore favorit mahasiswa.",
				vendor_additional_info: {
					type: "snack",
					specialty: "jagung susu keju legit",
					starting_price: 7000,
					price_range: "low",
					open_hour: "14:00",
					close_hour: "22:00",
					rating: 4.3,
					tags: ["snack", "sweet"],
					popularity: 75,
				},
			},
			{
				username: "vendor_burger_pinggir",
				name: "Burger Pinggir Jalan",
				email: "burger@test.com",
				password: hashedPassword,
				role: "vendor",
				vendor_status: "active",
				description:
					"Burger kaki lima dengan rasa sederhana tapi murah dan mengenyangkan.",
				vendor_additional_info: {
					type: "food",
					specialty: "burger murah meriah",
					starting_price: 10000,
					price_range: "low",
					open_hour: "16:00",
					close_hour: "01:00",
					rating: 4.2,
					tags: ["burger", "fast food"],
					popularity: 78,
				},
			},

			// =========================
			// CUSTOMERS
			// =========================
			{
				username: "cust_alwan",
				name: "Alwan Athallah Mumtaz",
				email: "alwan@test.com",
				password: hashedPassword,
				role: "consumer",
			},
			{
				username: "cust_raka",
				name: "Raka Anak Kos 3A",
				email: "raka@test.com",
				password: hashedPassword,
				role: "consumer",
			},
			{
				username: "cust_fajar",
				name: "Fajar Laper Tanpa Tujuan",
				email: "fajar@test.com",
				password: hashedPassword,
				role: "consumer",
			},
			{
				username: "cust_dimas",
				name: "Dimas Jam 2 Pagi",
				email: "dimas@test.com",
				password: hashedPassword,
				role: "consumer",
			},
			{
				username: "cust_rehan",
				name: "Rehan Kosan Lantai 2",
				email: "rehan@test.com",
				password: hashedPassword,
				role: "consumer",
			},
			{
				username: "cust_ayu",
				name: "Ayu Korban Seblak",
				email: "ayu@test.com",
				password: hashedPassword,
				role: "consumer",
			},
			{
				username: "cust_ilham",
				name: "Ilham Scroll TikTok 5 Jam",
				email: "ilham@test.com",
				password: hashedPassword,
				role: "consumer",
			},
			{
				username: "cust_nadia",
				name: "Nadia Pencari Nasi Kuning",
				email: "nadia@test.com",
				password: hashedPassword,
				role: "consumer",
			},
			{
				username: "cust_farel",
				name: "Farel Kehujanan Tanpa Payung",
				email: "farel@test.com",
				password: hashedPassword,
				role: "consumer",
			},
			{
				username: "cust_dea",
				name: "Dea Sedikit Kehilangan Arah",
				email: "dea@test.com",
				password: hashedPassword,
				role: "consumer",
			},
		];

		const { data, error } = await supabase.from("users").insert(users).select();

		if (error) {
			console.error("Seed error:", error);
			return;
		}

		console.log("Seed success:", data.length, "users inserted");
	} catch (err) {
		console.error(err);
	}
};

seedUsers();
