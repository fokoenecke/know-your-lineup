<script lang="ts">
	import { getGenreName } from '$lib/deezer';
	import { filtering } from '$lib/stores/filtering';
	import { ArrowLeftCircleIcon, ChevronsLeftIcon, RotateCcwIcon } from 'svelte-feather-icons';
	import { fly } from 'svelte/transition';

	let filterGenres: number[] = [0, 132, 152, 85, 106, 113, 466, 144, 464, 116, 522];

	const rotateFilterGenre = () => {
		const firstGenre = filterGenres.shift();
		if (typeof firstGenre === 'number') {
			filterGenres.push(firstGenre);
		}
		filterGenres = filterGenres;
		filtering.setGenre(filterGenres[0]);
	};

	const unrotateFilterGenre = () => {
		const firstGenre = filterGenres.pop();
		if (typeof firstGenre === 'number') {
			filterGenres.unshift(firstGenre);
		}
		filterGenres = filterGenres;
		filtering.setGenre(filterGenres[0]);
	};
</script>

<div class="filter">
	<span>show</span>

	{#key $filtering.genre}
		<span
			in:fly={{ y: -20 }}
			on:keydown={rotateFilterGenre}
			on:click={rotateFilterGenre}
			class="genre">{getGenreName($filtering.genre)}</span
		>
	{/key}
	<span on:keydown={unrotateFilterGenre} on:click={unrotateFilterGenre} class="back"
		><ChevronsLeftIcon size="0.9x" /></span
	>
	<span>artists</span>
</div>

<style>
	.filter {
		display: flex;
		align-items: center;
		font-size: large;

		padding-top: 0.25rem;
	}

	.genre,
	.back {
		display: flex;
		cursor: pointer;

		background-color: #e0e0e0;
		border-radius: 0.2rem;
	}

	.back {
		padding: 0.25rem 0.3rem 0.25rem 0.3rem;
		margin-right: 0.5rem;
	}

	.genre {
		padding: 0.1rem 0.3rem 0.1rem 0.3rem;
		margin-left: 0.5rem;
		margin-right: 0.3rem;
	}

	.genre:hover,
	.back:hover {
		background-color: #0f0f0f;
		color: white;
	}
</style>
