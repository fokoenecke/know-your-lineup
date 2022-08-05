<script lang="ts">
	import { playlist } from '$lib/stores/playlist.js';
	let sidebarVisible: boolean = false;

	export function toggleSidebar() {
		sidebarVisible = !sidebarVisible;
	}
</script>

{#if sidebarVisible}
	<div id="faded-background" on:click={toggleSidebar} />
	<div id="sidebar">
		<h3>Queue</h3>
		<ul id="playlist">
			{#each $playlist as track, i}
				<li
					class="pointable"
					on:click={() => {
						playlist.remove(i);
					}}
				>
					{String(i).padStart(3, '0')}
					{track.artists.map((artist) => artist.name).join(',')} - {track.name}
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	#sidebar {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		border-left: 1px solid black;
		background: white;
		overflow-y: auto;
		width: 25rem;
		z-index: 2;
		display: flex;
		flex-direction: column;
	}
	#playlist {
		list-style-type: none;
		overflow: auto;
		-ms-overflow-style: none;
		scrollbar-width: none;
		margin: 0.25rem;
	}
	#sidebar h3 {
		text-transform: uppercase;
		margin: 0.25rem;
	}
	.pointable {
		cursor: pointer;
	}
	#playlist li:hover {
		background-color: grey;
	}
	#playlist li {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	#faded-background {
		z-index: 1;
		background-color: rgba(100, 100, 100, 0.7);
		height: 100vh;
		width: 100vw;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
