export default (initialState: any) => {
  const { userPermission } = initialState
  const user = userPermission.user as UserType;
  const permission = userPermission.permissions as string[];

  const canSeeAdmin = user.is_staff || user.is_superuser;
  const canSeePendaftaran = true // permission.includes('')
  const canSeePemeriksaan = true // permission.includes('')
  const canSeeLab = true // permission.includes('')
  const canSeeEkg = true // permission.includes('')
  const canSeeRontgen = true // permission.includes('')
  const canSeeKartuKuning = true // permission.includes('')

  return {
    canSeeAdmin: canSeeAdmin,
    canSeePendaftaran: canSeePendaftaran || canSeeAdmin,
    canSeePemeriksaan: canSeePemeriksaan || canSeeAdmin,
    canSeeLab: canSeeLab || canSeeAdmin,
    canSeeEkg: canSeeEkg || canSeeAdmin,
    canSeeRontgen: canSeeRontgen || canSeeAdmin,
    canSeeKartuKuning: canSeeKartuKuning || canSeeAdmin
  };
};
