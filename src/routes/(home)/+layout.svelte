<script lang="ts">
	import '../../css/normalize.css';
	import '../../css/style.css';
</script>

<div class="grid-container">
	<header class="header">
		<div class="center">
			<div class="title">
				<span class="name">know your lineup</span>
			</div>
		</div>
	</header>
	<main class="main">
		<div class="center"><slot /></div>
	</main>
	<footer class="footer">
		<div class="center" />
	</footer>
</div>

<style>
	.grid-container {
		display: grid;
		height: 100vh;
		grid-template-rows: auto 1fr auto;
	}

	header {
		border-bottom: 1px solid #101010;
		display: flex;
		align-items: center;
		justify-content: left;
	}

	.title {
		display: flex;
		align-items: center;
		padding: 0.5rem 0 0.5rem 1rem;

		flex-direction: column;
		justify-content: center;
		align-items: start;
	}
	.name {
		font-size: x-large;
		font-weight: bold;
	}

	main {
		overflow-y: auto;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	main::-webkit-scrollbar {
		display: none;
	}

	.center {
		flex: 1;
		max-width: 1200px;
		margin: 0 auto 0 auto;
	}

	footer {
		border-top: 1px solid #101010;
	}
</style>
