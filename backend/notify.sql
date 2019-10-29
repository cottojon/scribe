-- to use listen/notify feature
CREATE FUNCTION public.realtime_notify()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF 
AS $BODY$BEGIN PERFORM pg_notify('new_clip', row_to_json(NEW)::text); RETURN NULL; END$BODY$;



CREATE TRIGGER realtime_clip_trigger
    AFTER INSERT OR UPDATE 
    ON public.clip
    FOR EACH ROW
    EXECUTE PROCEDURE public.realtime_notify();
