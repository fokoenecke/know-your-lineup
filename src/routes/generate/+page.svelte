<script lang="ts">
	import type { DeezerAlbum, DeezerArtist } from '$lib/deezer';
	import { sleep } from '$lib/sleep';

	let artistsTextfield: string;
	let resolvedArtists: DeezerArtist[] = [];

	const resolveNames = async () => {
		const trimmedArtists = artistsTextfield.split(/,|\n+/).map((artist) => artist.trim());
		for (const artist of trimmedArtists) {
			try {
				const response = await fetch(`/api/search/${encodeURIComponent(artist)}`);
				const foundArtist = (await response.json()) as DeezerArtist;
				await sleep(100);
				if (foundArtist.name.toLowerCase() !== artist.toLowerCase()) {
					console.log('ARTIST NAME NOT MATCHING INPUT!!!');
					console.log(foundArtist.name, artist);
				}

				if (foundArtist) {
					const albumResponse = await fetch(`/api/artist/${foundArtist.id}/albums`);
					const albums = (await albumResponse.json()) as DeezerAlbum[];
					sleep(100);
					const genres = new Set<number>();
					for (const album of albums) {
						genres.add(album.genre_id);
					}
					//console.log(genres);
					resolvedArtists.push(foundArtist);
				}
			} catch (err) {
				console.log(artist, err);
			}
		}
		resolvedArtists = resolvedArtists;
	};
</script>

<form>
	<label for="artistNames">Names</label>
	<textarea name="artistNames" cols="40" rows="25" bind:value={artistsTextfield} />
</form>

<button on:click={resolveNames}>search</button>

{resolvedArtists.length}
{#each resolvedArtists as artist}
	<div>{artist.name}</div>
{/each}

{JSON.stringify(resolvedArtists)}
