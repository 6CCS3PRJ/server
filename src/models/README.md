# Usage of `scan_generate.json`

Generates a file containing a json object with one field: `scans`.

This field contains a field.field is an array of `scan` objects that can be used to add new dummy scans to the database.

For help write:

```zsh
node scan_generate -h
```

the output will be:

```zsh
Options:
  -v, --version   Show version number [boolean]
  -r, --rows      The number of rows to generate [number]
  -f, --filename  The name of the file to generate (can also take path relative to where command is run) [string]
  -h, --help      Show help [boolean]
```

## Example output

```json
{
  "scans": [
    {
      "d": true,                            //dummy
      "t": "2020-12-04T17:01:15.756Z",      //date
      "b": "22:c3:e7:8b:fe:82",             //BSSID
      "l": 9                                //distance
    },
    [...]
    {
      "d": false,
      "t": "2020-12-03T20:15:08.557Z",
      "b": "28:b0:a2:03:4c:ff",
      "l": 20
    }
  ]
}
```
