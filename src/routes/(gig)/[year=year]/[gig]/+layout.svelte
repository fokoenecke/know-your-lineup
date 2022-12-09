<script lang="ts">
	import '../../../../css/normalize.css';
	import '../../../../css/style.css';
	import { page } from '$app/stores';

	import Player from '$lib/components/Player.svelte';
</script>

<div class="grid-container">
	<div class="header">
		<div class="center">
			<div class="title">
				<a href="/" class="name">know your lineup</a>
				<span class="gig">{$page.params.year} / {$page.params.gig}</span>
			</div>
		</div>
	</div>
	<div class="main">
		<div class="center"><slot /></div>
	</div>
	<div class="footer">
		<div class="center">
			<Player />
		</div>
	</div>
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-rows: 6vh 88vh 6vh;
	}

	.header {
		border-bottom: 1px solid black;
		display: flex;
		align-items: center;
		justify-content: left;
	}

	.title {
		height: 100%;
		display: flex;
		align-items: center;
		padding-left: 1rem;

		flex-direction: column;
		justify-content: center;
		align-items: start;
	}
	.name {
		font-size: x-large;
		font-weight: bold;
	}

	.name:hover::before {
		content: '<< ';
	}

	.main {
		overflow: scroll;
	}

	.center {
		flex: 1;
		height: 100%;
		max-width: 1200px;
		margin: 0 auto 0 auto;
	}

	.footer {
		border-top: 1px solid black;
		height: 100%;
	}
</style>
