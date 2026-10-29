<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<ul class="years">
	{#each Object.entries(data.gigsInYear) as [year, gigs] (year)}
		<li class="year">
			{year}
			<ul class="gigs">
				{#each gigs as gig (gig.slug)}
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
