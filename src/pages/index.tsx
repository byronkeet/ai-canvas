import { type NextPage } from "next";

import HomeHero from "../components/HomeHero";
import FeatureList from "../components/FeatureList";
import LeftImageCTA from "../components/LeftImageCTA";
import RightImageCTA from "../components/RightImageCTA";

const Home: NextPage = () => {
	return (
		<div>
			<HomeHero />
			<LeftImageCTA />
			<FeatureList />
			<RightImageCTA />
		</div>
	);
};

export default Home;
