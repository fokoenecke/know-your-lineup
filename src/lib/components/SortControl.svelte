<script lang="ts">
	import { sorting, type SortingAttribute } from '$lib/stores/sorting';

	const toggleSortDirection = () => {
		sorting.setDirection($sorting.direction === 'ascending' ? 'descending' : 'ascending');
	};

	let sortAttributes: SortingAttribute[] = ['name', 'nb_fan'];
	let sortLabels = {
		name: { name: 'name', ascending: 'a to z', descending: 'z to a' },
		nb_fan: { name: 'fans', ascending: 'low to high', descending: 'high to low' }
	} as {
		[index in SortingAttribute]: { name: string; ascending: string; descending: string };
	};

	const rotateSortAttribute = () => {
		const firstAttribute = sortAttributes.shift();
		if (firstAttribute) {
			sortAttributes.push(firstAttribute);
		}
		sortAttributes = sortAttributes;
		sorting.setAttribute(sortAttributes[0]);
	};
</script>

<div class="sort">
	<span class="label">sorted by</span>
	<span class="attribute" on:keydown={rotateSortAttribute} on:click={rotateSortAttribute}>
		{sortLabels[$sorting.attribute].name}
	</span>
	<span class="direction" on:keydown={toggleSortDirection} on:click={toggleSortDirection}>
		{sortLabels[$sorting.attribute][$sorting.direction]}
	</span>
</div>

<style>
	.sort {
		display: flex;
		justify-content: flex-start;
		align-items: center;

		font-size: large;
		transition: 0.1s ease-in-out;

		padding-top: 0.25rem;
	}

	.sort .attribute,
	.sort .direction {
		display: flex;
		cursor: pointer;
		margin-left: 0.5rem;

		background-color: #e0e0e0;
		border-radius: 0.2rem;
		padding: 0.1rem 0.3rem 0.1rem 0.3rem;
	}

	.sort .attribute:hover,
	.sort .direction:hover {
		background-color: #0f0f0f;
		color: white;
	}
</style>
