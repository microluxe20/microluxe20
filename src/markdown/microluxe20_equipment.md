![title-img](https://github.com/kgrubb/microluxe20/raw/master/src/static/logo-plain.png)
<h1 class="title">Microluxe 20 <br> <br> Equipment Tables</h1>

# Equipment

## Starting Wealth

The most common coin is the _gold piece_ (gp).

<!-- $data wealth.yml coins -->

You begin with a certain amount of acquired wealth, determined by your character class.

<!-- $data wealth.yml class_wealth -->

## Weapons

Here is the format for weapon entries (given as column headings on the table below):

- **Damage:** The damage column gives the damage dealt by the weapon on a successful hit.
- **Range:** Any attack less than this distance is not penalized. However, every extra 5ft. imposes a -2 penalty on the attack roll.
- **Complexity:** Different weapons require different amount of training to use. The level of complexity relies on the player's class. For example, Mages cannot use Complex weapons.
- **Cost:** This value is the price for purchasing the weapon. The cost includes miscellaneous gear that goes with the weapon (For example, buying a bow would include a quiver as well).

### Light Weapons

<!-- $data weapons.yml light -->

### Ranged Weapons

<!-- $data weapons.yml ranged -->

<h3 class="page-break"> Two-Handed Weapons </h3>

<!-- $data weapons.yml two-handed -->

### One-Handed Weapons

<!-- $data weapons.yml one-handed -->

## Armor & Shields

Here is the format for armor entries (given as column headings on the table below):

- **Size:** The physical size of the armor. Different classes can only wear specific sizes of armor. Similar to armor sizes, different types of shields are only available to certain classes as well.
- **Cost:** The normal price of the armor.
- **AC Bonus:** The Armor Class bonus provided by the armor when worn.

### Armor

<!-- $data armor.yml armor -->

### Shields

<!-- $data armor.yml shields -->

<h2 class="page-break"> Adventuring Equipment </h2>

Characters may purchase equipment from the following lists with their starting money or select one of the standard adventuring "fast packs".

### Adventuring Gear

<!-- $data gear.yml adventuring-gear -->

### Clothing

<!-- $data gear.yml clothing -->

### Mounts and Related Gear

<!-- $data gear.yml mounts -->

<h3 class="page-break"> Fast Equipment Packs </h3>

Suggested starting packs for new characters. Each pack uses 35gp of a character's starting money.

<!-- TODO: extend table constructor to allow this sort of data.  -->

| __Pack A__ | __Pack B__ | __Pack C__ |
| :--- | :--- | :--- |
| backpack | backpack | backpack |
| belt pouch | belt pouch | belt pouch |
| bedroll | bedroll | bedroll |
| hooded lantern | 10 torches | 10 torches |
| 10 oil flasks | 10 oil flasks | tent |
| flint & steel | flint & steel | flint & steel |
| shovel | chalk | hammer |
| 2 sets of caltrops | 10 ft. pole | 10 iron spikes |
| signal whistle | mirror | grappling hook |
| pen & paper | crowbar | 50 ft. rope |
| water skin | water skin | water skin |
| rations (4 days) | rations (4 days) | rations (4 days) |

Rogues are advised to purchase Thieves tools if they want to pick locks, disarm traps, etc.
