<script lang="ts">
	import type { ActionData, PageData } from './$types';

	import Button from '$ui/components/button.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function formatDate(date: Date | string | null) {
		if (!date) return '—';
		return new Intl.DateTimeFormat('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(date));
	}
</script>

<div class="mx-auto max-w-3xl">
	<!-- Back link -->
	<a href="/news" class="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold no-underline">
		← Back to News
	</a>

	<article class="panel mt-4 p-6 sm:p-10">
		<!-- Status badge -->
		<div class="flex items-start justify-between gap-4">
			<p class="kicker">Article</p>

			{#if data.canManage}
				{#if data.article.status === 'published'}
					<span
						class="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-success"
					>
						Published
					</span>
				{:else}
					<span
						class="rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-warning"
					>
						Draft
					</span>
				{/if}
			{/if}
		</div>

		<h1 class="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{data.article.title}
		</h1>

		{#if data.article.summary}
			<p class="mt-4 text-lg leading-7 text-muted">{data.article.summary}</p>
		{/if}

		<!-- Meta row -->
		<div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line/70 pt-5 text-sm text-muted">
			<span>By <strong class="text-ink">{data.article.authorName}</strong></span>
			{#if data.article.status === 'published' && data.article.publishedAt}
				<span>Published {formatDate(data.article.publishedAt)}</span>
			{:else}
				<span>Created {formatDate(data.article.createdAt)}</span>
			{/if}
		</div>

		<!-- Error feedback -->
		{#if form?.message}
			<div class="mt-6 rounded-3xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
				{form.message}
			</div>
		{/if}

		<!-- Body -->
		<div class="prose prose-sm sm:prose mt-8 max-w-none whitespace-pre-wrap text-ink/90 leading-7">
			{data.article.body}
		</div>

		<!-- Actions -->
		{#if data.canManage}
			<div class="mt-10 flex flex-wrap items-center gap-3 border-t border-line/70 pt-6">
				<a href="/news/{data.article.id}/edit">
					<Button variant="ghost">Edit</Button>
				</a>

				{#if data.canPublish}
					{#if data.article.status === 'draft'}
						<form method="POST" action="?/publish">
							<Button type="submit">Publish</Button>
						</form>
					{:else}
						<form method="POST" action="?/unpublish">
							<Button type="submit" variant="secondary">Revert to Draft</Button>
						</form>
					{/if}
				{/if}

				{#if data.canDelete}
					<form
						method="POST"
						action="?/delete"
						onsubmit={(e) => {
							if (!confirm('Delete this article? This cannot be undone.')) e.preventDefault();
						}}
					>
						<Button type="submit" variant="danger">Delete</Button>
					</form>
				{/if}
			</div>
		{/if}
	</article>
</div>
