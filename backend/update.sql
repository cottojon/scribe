UPDATE public.clip
	SET text=Concat(text, 'more text to add here')
	WHERE id = 2;