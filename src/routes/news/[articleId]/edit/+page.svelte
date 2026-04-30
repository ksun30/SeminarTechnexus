<script lang="ts">
	import type { ActionData, PageData } from './$types';

	import Button from '$ui/components/button.svelte';
	import Input from '$ui/components/input.svelte';
	import Textarea from '$ui/components/textarea.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section class="mx-auto max-w-3xl">
	<div>
		<p class="kicker">News</p>
		<h1 class="page-title mt-3">Edit Article</h1>
		<p class="page-copy mt-4">Update the article content. Changes are saved as the current status.</p>
	</div>

	<form class="panel mt-8 space-y-6 p-6 sm:p-8" method="POST">
		{#if form?.message}
			<div class="rounded-3xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
				{form.message}
			</div>
		{/if}

		<Input
			id="title"
			name="title"
			label="Title"
			placeholder="e.g. Q2 Product Launch Recap"
			required
			value={form?.form?.title ?? data.article.title}
			error={form?.errors?.title?.[0]}
		/>

		<Input
			id="summary"
			name="summary"
			label="Summary"
			placeholder="A short teaser shown in the article list (optional)"
			value={form?.form?.summary ?? data.article.summary ?? ''}
			error={form?.errors?.summary?.[0]}
		/>

		<Textarea
			id="body"
			name="body"
			label="Body"
			placeholder="Write the full article content here…"
			value={form?.form?.body ?? data.article.body}
			error={form?.errors?.body?.[0]}
		/>

		<div class="flex flex-wrap gap-3">
			<Button type="submit">Save Changes</Button>
			<a href="/news/{data.article.id}">
				<Button type="button" variant="ghost">Cancel</Button>
			</a>
		</div>
	</form>
</section>
