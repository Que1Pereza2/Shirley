use Shirley;

insert into city(name, state, km2)
	value('New York', 'New York',1223);
insert into city(name, state, km2)
	value('Los Angeles', 'California', 1290);
insert into city(name, state, km2)
	value('Chicago', 'Illinois', 607);
insert into city(name, state, km2)
	value('Houston', 'Texas', 1740);
insert into city(name, state, km2)
	value('Pheonix', 'Arizona', 1344);
insert into city(name, state, km2)
	value('Philadelphia', 'Pennsylvania', 369);

-- ny chicago
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, TRUE, 
(select id from city where id = 1), 
(select id from city where id = 3));
-- ny philly
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, FALSE, 
(select id from city where id = 1), 
(select id from city where id = 6));

-- la pheonix
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, TRUE, 
(select id from city where id = 2), 
(select id from city where id = 5));
-- la houston
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, FALSE, 
(select id from city where id = 2),
(select id from city where id = 4));

-- chicago huston
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, TRUE,
(select id from city where id = 3),
(select id from city where id = 4));
-- chicago pheonix
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, FALSE,
(select id from city where id = 3),
(select id from city where id = 5));
-- chicago ny
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, TRUE,
(select id from city where id = 3),
(select id from city where id = 1));

-- houston la
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, FALSE,
(select id from city where id = 4),
(select id from city where id = 2));
-- houston chicago
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, TRUE,
(select id from city where id = 4),
(select id from city where id = 3));
-- houston philly
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, FALSE,
(select id from city where id = 4),
(select id from city where id = 6));

-- pheonix la
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, TRUE,
(select id from city where id = 5),
(select id from city where id = 2));
-- pheonix chicago
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, FALSE,
(select id from city where id = 5),
(select id from city where id = 3));

-- philly houston
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, TRUE,
(select id from city where id = 6),
(select id from city where id = 4));
-- philly ny
insert into links( weather, airTraficCongestion, wildlifeCrossings, idStart, idFinish)
	value(1, 30, FALSE,
(select id from city where id = 6),
(select id from city where id = 1));