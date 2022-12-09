<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<ul class="years">
	{#each Object.entries(data.gigsInYear) as [year, gigs]}
		<li class="year">
			{year}
			<ul class="gigs">
				{#each gigs as gig}
					<li class="gig">
						<a href={`/${year}/${gig.slug}`}>{gig.name}</a>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>

<style>
	.years {
		padding-left: 1rem;
	}

	.year {
		font-size: xx-large;
		font-weight: bold;
	}

	.gigs {
		padding-left: 1rem;
	}

	.gig {
		font-size: x-large;
		font-weight: bold;
	}

	.gig a:hover::before {
		content: '>> ';
	}
</style>
