/*
 Set initial values for QB
 */
if (QB && (typeof QB == 'object')) {
    QB.apptoken = "c6pdvcydna3cfub95tnxxksjvim";
    QB.async = true;
} else {
    throw new Error('Namespace \'QB\' does not exist')
}

QB.realmhost = {
    url: "https://qbs.quickbase.com/db/main",
    apptoken: "c6pdvcydna3cfub95tnxxksjvim",
}

QB.application_dbid = {
    url: "https://qbs.quickbase.com/db/bji7ihduw",
    apptoken: "c6pdvcydna3cfub95tnxxksjvim",
}

/*
 Use CM to set common application values (e.g. User roles, testing users, etc.
 */

var cM;

if (typeof cM == 'object') {
    throw new Error('Namespace \'cM\' already exists')
} else {
    cM = {
        name: 'cM',
        appl_id: function () {
            return QB.application_dbid
        },
        current_user: function () {
            return '_curuser_'
            //   return 'someuser@cloudbaseservices.com'

        }
    }
}
/*
    options for testing
*/
cM.no_quickbase = true;
cM.options = [{},]
/*
 Temporary functions:
 clist: generate a clist based on fields declared
 xref: allow fields to be referred to by id or name
 */

cM.clist = function (db_record) {
    return $.map(db_record.db_map, function (m, i) {
        return m.fid;
    }).join(".");
}

cM.xref = function (db_record) {
    var self = this;
    $.each(db_record.db_map, function (key, field) {
        self[field.name] = field;
        self[field.fid] = field;
    });
}
/*
 NDS Baseline - Autocompletion
 */

cM.Autocomplete = function () {
    DBRecord.call(this);
};
cM.Autocomplete.url = "https://qbs.quickbase.com/db/bji7ihdz6";
cM.Autocomplete.apptoken = "c6pdvcydna3cfub95tnxxksjvim";
cM.Autocomplete.table_alias = '_DBID_AUTOCOMPLETIONS'

cM.Autocomplete.db_map = [
    {
        fid: "3",
        name: "rid"
    }, {
        fid: "6",
        name: "level_0",
        allowed_value: function (value) {
            var cars = ['Ford', 'Saab', 'Tesla']
            var allowed = false;
            $.each(cars, function (idx, car) {
                if (value == car) {
                    allowed = true;
                    return false;
                }
            });
            return allowed;
        }

    }, {
        fid: "7",
        name: "level_1"

    }, {
        fid: "8",
        name: "level_2"

    }
];

cM.Autocomplete.xref = new cM.xref(cM.Autocomplete);

cM.Autocomplete.queries = {
    get_values: function () {
        var opts = {
            clist: cM.clist(cM.Autocomplete),
            slist: '6,7,8'
        }

        opts.query = "{'" + cM.Autocomplete.xref.level_0.fid + "'.XEX.''}";
        return opts;
    }

};
